const nodemailer = require("nodemailer");

const STAFF_EMAIL = "info@eaglepamexpeditionsandtravel.com";

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
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

    const smtpUser = process.env.ZOHO_SMTP_USER;
    const smtpPassword = process.env.ZOHO_SMTP_APP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
        console.error("Booking email is not configured: Zoho SMTP environment variables are missing.");
        return res.status(503).json({ error: "Enquiry email is temporarily unavailable. Please contact us by WhatsApp." });
    }

    const smtpPort = Number(process.env.ZOHO_SMTP_PORT || 465);
    const smtpHost = process.env.ZOHO_SMTP_HOST || "smtp.zoho.com";
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

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    try {
        await transporter.sendMail({
            from: `Eagle Pam Expeditions <${smtpUser}>`,
            to: STAFF_EMAIL,
            replyTo: email,
            subject: `Safari planning enquiry | ${subjectDestination}`,
            text: emailText
        });
    } catch (error) {
        console.error("Zoho SMTP failed to send a booking enquiry.", {
            code: error && error.code,
            responseCode: error && error.responseCode
        });
        return res.status(502).json({ error: "We could not send your enquiry just now. Please try again or contact us by WhatsApp." });
    }

    return res.status(200).json({ message: "Your enquiry has been sent to our safari team." });
};
