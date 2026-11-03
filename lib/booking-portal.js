const nodemailer = require("nodemailer");

const STAFF_INBOX = "info@eaglepamexpeditionsandtravel.com";
const QUOTE_CURRENCIES = new Set(["USD", "KES", "EUR", "GBP"]);

function getSettings() {
    const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    return {
        supabaseUrl,
        supabaseAnonKey,
        supabaseServiceRoleKey,
        staffEmails: [STAFF_INBOX],
        hasSupabase: Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey)
    };
}

function jsonResponse(res, status, payload) {
    return res.status(status).json(payload);
}

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSupabaseHeaders(settings, accessToken = settings.supabaseServiceRoleKey) {
    return {
        apikey: settings.supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
}

async function supabaseRequest(settings, path, options = {}) {
    const response = await fetch(`${settings.supabaseUrl}/rest/v1/${path}`, {
        ...options,
        headers: {
            ...getSupabaseHeaders(settings),
            ...(options.headers || {})
        }
    });
    const responseText = await response.text();
    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error("Supabase returned an unreadable response.");
        }
    }

    if (!response.ok) {
        console.error("Supabase request failed.", {
            status: response.status,
            error: data?.message || data?.error
        });
        throw new Error("The booking system is temporarily unavailable.");
    }

    return data;
}

async function requireStaff(req, res) {
    const settings = getSettings();
    if (!settings.hasSupabase || !settings.staffEmails.length) {
        jsonResponse(res, 503, { error: "Staff portal authentication is not configured." });
        return null;
    }

    const accessToken = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) {
        jsonResponse(res, 401, { error: "Please sign in to the staff portal." });
        return null;
    }

    const response = await fetch(`${settings.supabaseUrl}/auth/v1/user`, {
        headers: {
            apikey: settings.supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`
        }
    });
    if (!response.ok) {
        jsonResponse(res, 401, { error: "Your staff session has expired. Please sign in again." });
        return null;
    }

    const user = await response.json();
    const email = typeof user.email === "string" ? user.email.toLowerCase() : "";
    if (!settings.staffEmails.includes(email)) {
        jsonResponse(res, 403, { error: "This account is not authorized to use the staff portal." });
        return null;
    }

    return { settings, email };
}

function mailTransport() {
    const smtpUser = process.env.ZOHO_USER;
    const smtpPassword = process.env.ZOHO_PASS;
    if (!smtpUser || !smtpPassword) return null;

    return nodemailer.createTransport({
        host: process.env.ZOHO_HOST || "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPassword }
    });
}

async function sendMail({ to, subject, text: message }) {
    const transporter = mailTransport();
    if (!transporter) return false;

    try {
        await transporter.sendMail({
            from: `Eagle Pam Expeditions <${process.env.ZOHO_USER}>`,
            to,
            replyTo: STAFF_INBOX,
            subject,
            text: message
        });
        return true;
    } catch (error) {
        console.error("Booking portal email notification failed.", {
            code: error && error.code,
            responseCode: error && error.responseCode
        });
        return false;
    }
}

module.exports = {
    STAFF_INBOX,
    QUOTE_CURRENCIES,
    getSettings,
    jsonResponse,
    text,
    validEmail,
    supabaseRequest,
    requireStaff,
    sendMail
};
