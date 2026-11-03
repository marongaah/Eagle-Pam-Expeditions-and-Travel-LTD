const { Resend } = require("resend");

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

    // Honeypot field: real visitors leave it empty.
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

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error("Contact enquiry email is not configured: RESEND_API_KEY is missing.");
        return res.status(503).json({ error: "We couldn't send your message just now. Please try again later." });
    }

    const recipient = process.env.ENQUIRY_TO || "info@eaglepamexpeditionsandtravel.com";
    const sender = process.env.ENQUIRY_FROM || "Eagle Pam Expeditions <enquiries@eaglepamexpeditionsandtravel.com>";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeCountry = escapeHtml(country || "Not provided");
    const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");

    const resend = new Resend(apiKey);

    try {
        // Resend returns { data, error } instead of throwing, so check both.
        const { error } = await resend.emails.send({
            from: sender,
            to: [recipient],
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

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error("Resend failed to send a contact enquiry.", {
            name: error && error.name,
            message: error && error.message
        });
        return res.status(502).json({ error: "We couldn't send your message just now. Please try again." });
    }

    return res.status(200).json({ message: "Thank you, we'll reply shortly." });
};