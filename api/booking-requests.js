const {
    STAFF_INBOX,
    getSettings,
    jsonResponse,
    text,
    validEmail,
    supabaseRequest,
    sendMail
} = require("../lib/booking-portal");

function parseAmount(value) {
    if (value === undefined || value === null || value === "") return null;
    if (!/^\d+(?:\.\d{1,2})?$/.test(String(value))) return null;
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 && amount <= 100000000
        ? Math.round(amount * 100) / 100
        : null;
}

function validDate(value) {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function bookingEmail(data) {
    return [
        "NEW SAFARI BOOKING REQUEST",
        "",
        `Safari: ${data.safari}`,
        `Requested departure: ${data.departureDate || "To be confirmed"}`,
        `Package option: ${data.packageOption || "Not specified"}`,
        `Guide language: ${data.guideLanguage || "Not specified"}`,
        `Travellers: ${data.travellerCount}`,
        `Estimated total: ${data.estimatedTotal === null ? "To be confirmed" : `${data.requestedCurrency} ${data.estimatedTotal}`}`,
        "",
        `Lead traveller: ${data.travellerName}`,
        `Email: ${data.email}`,
        `Phone / WhatsApp: ${data.phone}`,
        `City / country: ${data.country || "Not provided"}`,
        "",
        "Additional requests:",
        data.notes || "None provided.",
        "",
        "No payment has been collected. Confirm availability and the final amount in the staff booking portal before requesting a deposit."
    ].join("\n");
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return jsonResponse(res, 405, { error: "Method not allowed." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (text(body.website, 200)) {
        return jsonResponse(res, 200, { message: "Thank you, we'll reply shortly." });
    }

    const data = {
        travellerName: text(body.name, 120),
        email: text(body.email, 254),
        phone: text(body.phone, 50),
        country: text(body.country, 100),
        safari: text(body.safari, 180),
        departureDate: text(body.departureDate, 10),
        packageOption: text(body.packageOption, 120),
        guideLanguage: text(body.guideLanguage, 80),
        travellerCount: Number(body.travellerCount),
        requestedCurrency: text(body.currency, 3).toUpperCase(),
        estimatedTotal: parseAmount(body.estimatedTotal),
        notes: text(body.notes, 2000)
    };

    if (
        !data.travellerName ||
        !validEmail(data.email) ||
        !data.phone ||
        !data.safari ||
        !Number.isInteger(data.travellerCount) ||
        data.travellerCount < 1 ||
        data.travellerCount > 100 ||
        !["USD", "KES", "EUR", "GBP"].includes(data.requestedCurrency) ||
        (body.estimatedTotal !== null && body.estimatedTotal !== undefined && body.estimatedTotal !== "" && data.estimatedTotal === null) ||
        !validDate(data.departureDate)
    ) {
        return jsonResponse(res, 400, { error: "Please review your traveller and safari details and try again." });
    }

    const settings = getSettings();
    const emailText = bookingEmail(data);
    const anySupabaseSettings = Boolean(
        settings.supabaseUrl ||
        settings.supabaseAnonKey ||
        settings.supabaseServiceRoleKey
    );

    if (!settings.hasSupabase) {
        if (anySupabaseSettings) {
            console.error("Booking request storage is partially configured.");
            return jsonResponse(res, 503, { error: "The booking system is being configured. Please try again later." });
        }

        const notified = await sendMail({
            to: process.env.ENQUIRY_TO || STAFF_INBOX,
            subject: `New safari booking request | ${data.safari}`,
            text: emailText
        });
        if (!notified) {
            return jsonResponse(res, 503, {
                error: "We couldn't send your request just now. Please try again later."
            });
        }

        return jsonResponse(res, 201, {
            mode: "email_only",
            message: "Request sent to the safari team. Payment will only be requested after staff confirms availability and the final price."
        });
    }

    const row = {
        traveller_name: data.travellerName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        safari: data.safari,
        departure_date: data.departureDate || null,
        package_option: data.packageOption,
        guide_language: data.guideLanguage,
        traveller_count: data.travellerCount,
        requested_currency: data.requestedCurrency,
        estimated_total: data.estimatedTotal,
        notes: data.notes
    };

    try {
        const inserted = await supabaseRequest(settings, "booking_requests", {
            method: "POST",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify(row)
        });
        const request = inserted?.[0];
        if (!request?.id) throw new Error("Supabase did not return the saved booking request.");

        const notified = await sendMail({
            to: process.env.ENQUIRY_TO || STAFF_INBOX,
            subject: `New safari booking request | ${data.safari}`,
            text: `${emailText}\n\nStaff portal request ID: ${request.id}`
        });

        return jsonResponse(res, 201, {
            mode: "staff_portal",
            notificationSent: notified,
            message: notified
                ? "Your request is with our safari team. They will confirm availability and the final price before requesting any deposit."
                : "Your request has been saved for our safari team. Email notification is temporarily unavailable; the team can see it in the staff portal."
        });
    } catch (error) {
        console.error("Booking request could not be saved.", error);
        return jsonResponse(res, 503, {
            error: "We couldn't save your request just now. Please try again later."
        });
    }
};

module.exports.config = { api: { bodyParser: { sizeLimit: "20kb" } } };
