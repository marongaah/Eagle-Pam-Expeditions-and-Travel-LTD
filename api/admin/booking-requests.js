const {
    STAFF_INBOX,
    QUOTE_CURRENCIES,
    getSettings,
    jsonResponse,
    text,
    requireStaff,
    supabaseRequest,
    sendMail
} = require("../../lib/booking-portal");

function parseAmount(value) {
    if (typeof value !== "number" && typeof value !== "string") return null;
    if (!/^\d+(?:\.\d{1,2})?$/.test(String(value).trim())) return null;
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 1 && amount <= 100000000
        ? Math.round(amount * 100) / 100
        : null;
}

function validId(value) {
    return typeof value === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function bookingReference(id) {
    return `EP-${id.slice(0, 8).toUpperCase()}`;
}

async function getRequest(settings, id) {
    const records = await supabaseRequest(
        settings,
        `booking_requests?select=id,status,email,traveller_name,safari,departure_date,requested_currency,estimated_total,final_total,payment_currency,deposit_amount,payment_instructions&id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return records?.[0] || null;
}

async function confirmQuote(settings, id, body, staffEmail) {
    const finalTotal = parseAmount(body.finalTotal);
    const currency = text(body.currency, 3).toUpperCase();
    const bankDetails = typeof body.bankDetails === "string" ? body.bankDetails.trim() : "";

    if (finalTotal === null) {
        return { status: 400, payload: { error: "Enter a valid final quote amount greater than zero." } };
    }
    if (!QUOTE_CURRENCIES.has(currency)) {
        return { status: 400, payload: { error: "Choose a supported quote currency." } };
    }
    if (!bankDetails || bankDetails.length > 2000) {
        return { status: 400, payload: { error: "Enter bank transfer instructions (up to 2,000 characters)." } };
    }

    const request = await getRequest(settings, id);
    if (!request) return { status: 404, payload: { error: "This booking request could not be found." } };
    if (request.status !== "pending") {
        return { status: 409, payload: { error: "This request has already been confirmed or closed." } };
    }

    const deposit = Math.round(finalTotal * 0.3 * 100) / 100;
    const updated = await supabaseRequest(
        settings,
        `booking_requests?id=eq.${encodeURIComponent(id)}&status=eq.pending`,
        {
            method: "PATCH",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({
                status: "awaiting_payment",
                payment_status: "awaiting_bank_transfer",
                final_total: finalTotal,
                payment_currency: currency,
                deposit_amount: deposit,
                payment_instructions: bankDetails,
                confirmed_at: new Date().toISOString(),
                confirmed_by: staffEmail,
                updated_at: new Date().toISOString()
            })
        }
    );
    if (!updated?.length) {
        return { status: 409, payload: { error: "Another staff member already updated this request. Refresh the portal." } };
    }

    const emailSent = await sendMail({
        to: request.email,
        subject: `Confirmed safari quote | ${request.safari}`,
        text: [
            `Hello ${request.traveller_name},`,
            "",
            `Our team has confirmed availability for ${request.safari}${request.departure_date ? ` on ${request.departure_date}` : ""}.`,
            `Booking reference: ${bookingReference(request.id)}`,
            `Final trip total: ${currency} ${finalTotal.toFixed(2)}`,
            `30% deposit to confirm: ${currency} ${deposit.toFixed(2)}`,
            "",
            "BANK TRANSFER INSTRUCTIONS",
            bankDetails,
            "",
            `Please use booking reference ${bookingReference(request.id)} as your transfer reference. Your booking is confirmed after our team verifies receipt of the deposit.`,
            "",
            "Please reply to this email if you have any questions."
        ].join("\n")
    });

    if (!emailSent) {
        await sendMail({
            to: process.env.ENQUIRY_TO || STAFF_INBOX,
            subject: `Booking confirmed; client email failed | ${request.safari}`,
            text: [
                `The quote for ${request.traveller_name} was confirmed, but the client email could not be sent.`,
                `Client: ${request.email}`,
                `Final total: ${currency} ${finalTotal.toFixed(2)}`,
                `Deposit: ${currency} ${deposit.toFixed(2)}`,
                "",
                bankDetails
            ].join("\n")
        });
    }

    return {
        status: 200,
        payload: {
            emailSent,
            message: emailSent
                ? "The confirmed quote and bank transfer instructions were emailed to the client."
                : "The quote was saved, but the client email could not be sent. The bank details remain visible in the portal."
        }
    };
}

async function markDepositPaid(settings, id, staffEmail) {
    const request = await getRequest(settings, id);
    if (!request) return { status: 404, payload: { error: "This booking request could not be found." } };
    if (request.status !== "awaiting_payment") {
        return { status: 409, payload: { error: "Only a confirmed request awaiting transfer can be marked paid." } };
    }

    const now = new Date().toISOString();
    const updated = await supabaseRequest(
        settings,
        `booking_requests?id=eq.${encodeURIComponent(id)}&status=eq.awaiting_payment&payment_status=eq.awaiting_bank_transfer`,
        {
            method: "PATCH",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({
                status: "deposit_paid",
                payment_status: "paid",
                paid_at: now,
                paid_recorded_by: staffEmail,
                updated_at: now
            })
        }
    );
    if (!updated?.length) {
        return { status: 409, payload: { error: "This deposit was already updated. Refresh the portal." } };
    }

    const emailSent = await sendMail({
        to: request.email,
        subject: `Deposit received | ${request.safari}`,
        text: [
            `Hello ${request.traveller_name},`,
            "",
            `Our team has recorded receipt of your 30% deposit of ${request.payment_currency} ${Number(request.deposit_amount).toFixed(2)} for ${request.safari}.`,
            `Booking reference: ${bookingReference(request.id)}`,
            "We will follow up with your booking confirmation and remaining balance details.",
            "",
            "Please reply to this email if you have any questions."
        ].join("\n")
    });

    return {
        status: 200,
        payload: {
            emailSent,
            message: emailSent
                ? "The deposit was marked as received and a confirmation was emailed to the client."
                : "The deposit was marked as received. The client confirmation email could not be sent."
        }
    };
}

module.exports = async function handler(req, res) {
    if (req.method !== "GET" && req.method !== "PATCH") {
        res.setHeader("Allow", "GET, PATCH");
        return jsonResponse(res, 405, { error: "Method not allowed." });
    }

    let staff;
    try {
        staff = await requireStaff(req, res);
    } catch (error) {
        console.error("Staff authentication check failed.", error);
        return jsonResponse(res, 503, { error: "Staff sign-in is temporarily unavailable." });
    }
    if (!staff) return;

    if (req.method === "GET") {
        try {
            const requests = await supabaseRequest(
                staff.settings,
                "booking_requests?select=id,created_at,status,payment_status,traveller_name,email,phone,country,safari,departure_date,package_option,guide_language,traveller_count,requested_currency,estimated_total,notes,final_total,payment_currency,deposit_amount,payment_instructions,confirmed_at,confirmed_by,paid_at,paid_recorded_by&order=created_at.desc&limit=100"
            );
            return jsonResponse(res, 200, { requests, staffEmail: staff.email });
        } catch (error) {
            console.error("Staff booking requests could not be loaded.", error);
            return jsonResponse(res, 503, { error: "Booking requests could not be loaded. Please try again." });
        }
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (!validId(body.id)) {
        return jsonResponse(res, 400, { error: "Select a valid booking request." });
    }

    try {
        const result = body.action === "mark_paid"
            ? await markDepositPaid(staff.settings, body.id, staff.email)
            : body.action === "confirm_quote"
                ? await confirmQuote(staff.settings, body.id, body, staff.email)
                : { status: 400, payload: { error: "Choose a valid staff action." } };
        return jsonResponse(res, result.status, result.payload);
    } catch (error) {
        console.error("Staff booking request update failed.", error);
        return jsonResponse(res, 503, {
            error: "The booking request could not be updated. Please refresh and try again."
        });
    }
};

module.exports.config = { api: { bodyParser: { sizeLimit: "10kb" } } };
