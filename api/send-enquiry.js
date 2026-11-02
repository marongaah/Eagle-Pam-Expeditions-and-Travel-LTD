const STAFF_EMAIL = "info@eaglepamexpeditionsandtravel.com";

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (text(body.company_website, 200)) {
        return res.status(400).json({ error: "Please review your enquiry and try again." });
    }

    const name = text(body.name, 120);
    const email = text(body.email, 254);
    const phone = text(body.phone, 50);
    const destination = text(body.destination, 160);
    const date = text(body.date, 10);
    const days = text(body.days, 3);
    const travelers = text(body.travelers, 3);
    const budget = text(body.budget, 80);
    const message = text(body.message, 3000);

    if (!name || !isValidEmail(email) || !phone || !date || !travelers) {
        return res.status(400).json({ error: "Please check the required enquiry details and try again." });
    }

    const dateValue = new Date(`${date}T00:00:00.000Z`);
    const travelerCount = Number(travelers);
    const tripDays = days ? Number(days) : null;

    if (
        Number.isNaN(dateValue.getTime()) ||
        dateValue.toISOString().slice(0, 10) !== date ||
        !Number.isInteger(travelerCount) ||
        travelerCount < 1 ||
        travelerCount > 100 ||
        (days && (!Number.isInteger(tripDays) || tripDays < 1 || tripDays > 90))
    ) {
        return res.status(400).json({ error: "Please check the travel date, trip length, and group size." });
    }

    const apiToken = process.env.ZEPTOMAIL_API_TOKEN;
    const sender = process.env.ZEPTOMAIL_FROM || process.env.ZOHO_SMTP_USER || process.env.ZOHO_USER;
    const recipient = process.env.ENQUIRY_TO || STAFF_EMAIL;

    if (!apiToken || !sender) {
        console.error("Booking email is not configured: ZeptoMail API token or verified sender is missing.");
        return res.status(503).json({ error: "Enquiry email is temporarily unavailable. Please contact us by WhatsApp." });
    }

    const formattedDate = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(dateValue);
    const subjectDestination = (destination || "Custom safari").replace(/[\r\n]+/g, " ");
    const emailText = [
        "NEW SAFARI PLANNING ENQUIRY",
        "Eagle Pam Expeditions & Travel",
        "",
        "TRIP PREFERENCES",
        `Safari or destination: ${destination || "Not selected yet"}`,
        `Preferred departure date: ${formattedDate}`,
        `Trip duration: ${tripDays ? `${tripDays} days` : "Flexible / not specified"}`,
        `Group size: ${travelerCount} ${travelerCount === 1 ? "traveller" : "travellers"}`,
        `Preferred travel style: ${budget || "No preference selected"}`,
        "",
        "TRAVELLER CONTACT DETAILS",
        `Full name: ${name}`,
        `Email address: ${email}`,
        `Phone / WhatsApp: ${phone}`,
        "",
        "ADDITIONAL REQUESTS",
        message || "No additional requests provided."
    ].join("\n");

    const htmlText = (value) => escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");
    const htmlBody = [
        "<h2>New safari planning enquiry</h2>",
        "<h3>Trip preferences</h3>",
        `<p><strong>Safari or destination:</strong> ${escapeHtml(destination || "Not selected yet")}</p>`,
        `<p><strong>Preferred departure date:</strong> ${escapeHtml(formattedDate)}</p>`,
        `<p><strong>Trip duration:</strong> ${escapeHtml(tripDays ? `${tripDays} days` : "Flexible / not specified")}</p>`,
        `<p><strong>Group size:</strong> ${escapeHtml(`${travelerCount} ${travelerCount === 1 ? "traveller" : "travellers"}`)}</p>`,
        `<p><strong>Preferred travel style:</strong> ${escapeHtml(budget || "No preference selected")}</p>`,
        "<h3>Traveller contact details</h3>",
        `<p><strong>Full name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email address:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Phone / WhatsApp:</strong> ${escapeHtml(phone)}</p>`,
        "<h3>Additional requests</h3>",
        `<p>${htmlText(message || "No additional requests provided.")}</p>`
    ].join("");

    try {
        const response = await fetch("https://api.zeptomail.com/v1.1/email", {
            method: "POST",
            headers: {
                Authorization: `Zoho-enczapikey ${apiToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: {
                    address: sender,
                    name: "Eagle Pam Expeditions"
                },
                to: [{
                    email_address: {
                        address: recipient,
                        name: "Eagle Pam Expeditions Enquiries"
                    }
                }],
                reply_to: [{
                    address: email,
                    name
                }],
                subject: `Safari planning enquiry | ${subjectDestination}`,
                textbody: emailText,
                htmlbody: htmlBody
            }),
            signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
            console.error("ZeptoMail rejected a booking enquiry.", {
                status: response.status
            });
            return res.status(502).json({ error: "We could not send your enquiry just now. Please try again or contact us by WhatsApp." });
        }
    } catch (error) {
        console.error("ZeptoMail request failed to send a booking enquiry.", {
            name: error && error.name,
            code: error && error.cause && error.cause.code
        });
        return res.status(502).json({ error: "We could not send your enquiry just now. Please try again or contact us by WhatsApp." });
    }

    return res.status(200).json({ message: "Your enquiry has been sent to our safari team." });
};
