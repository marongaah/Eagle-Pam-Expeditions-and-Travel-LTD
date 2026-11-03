const nodemailer = require("nodemailer");

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (text(body.website, 200)) {
        return res.status(200).json({ message: "Thank you, we'll reply shortly." });
    }

    const name = text(body.name, 120);
    const email = text(body.email, 254);
    const phone = text(body.phone, 50);
    const country = text(body.country, 100);
    const message = text(body.message, 5000);

    if (!name || !isValidEmail(email) || !message) {
        return res.status(400).json({ error: "Please enter your name, a valid email address, and a message." });
    }

    const smtpUser = process.env.ZOHO_USER;
    const smtpPassword = process.env.ZOHO_PASS;

    if (!smtpUser || !smtpPassword) {
        console.error("Contact enquiry email is not configured: Zoho SMTP environment variables are missing.");
        return res.status(503).json({ error: "We couldn't send your message just now. Please try again later." });
    }

    const smtpHost = process.env.ZOHO_HOST || "smtp.zoho.com";
    const recipient = process.env.ENQUIRY_TO || "info@eaglepamexpeditionsandtravel.com";
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeCountry = escapeHtml(country || "Not provided");
    const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 465,
        secure: true,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    try {
        await transporter.sendMail({
            from: `Eagle Pam Expeditions <${smtpUser}>`,
            to: recipient,
            replyTo: email,
            subject: `New website enquiry from ${name.replace(/[\r\n]+/g, " ")}`,
            text: [
                "NEW WEBSITE ENQUIRY",
                "",
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone || "Not provided"}`,
                `Country: ${country || "Not provided"}`,
                "",
                "Message:",
                message
            ].join("\n"),
            html: `
                <h2>New website enquiry</h2>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Phone:</strong> ${safePhone}</p>
                <p><strong>Country:</strong> ${safeCountry}</p>
                <p><strong>Message:</strong><br>${safeMessage}</p>
            `
        });
    } catch (error) {
        console.error("Zoho SMTP failed to send a contact enquiry.", {
            code: error && error.code,
            responseCode: error && error.responseCode
        });
        return res.status(502).json({ error: "We couldn't send your message just now. Please try again." });
    }

    return res.status(200).json({ message: "Thank you, we'll reply shortly." });
};
