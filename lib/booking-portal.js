const { Resend } = require("resend");

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

// Server-side database access with the secret key.
// New-style secret keys ("sb_secret_...") are not JWTs, so they must only be sent in the
// apikey header. Legacy service_role keys are JWTs and are also sent as a Bearer token.
function getSupabaseHeaders(settings) {
    const key = settings.supabaseServiceRoleKey;
    const headers = {
        apikey: key,
        "Content-Type": "application/json"
    };

    if (!key.startsWith("sb_")) {
        headers.Authorization = `Bearer ${key}`;
    }

    return headers;
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

async function sendMail({ to, subject, text: message }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("Booking portal email is not configured: RESEND_API_KEY is missing.");
        return false;
    }

    const sender = process.env.ENQUIRY_FROM || "Eagle Pam Expeditions <enquiries@eaglepamexpeditionsandtravel.com>";
    const resend = new Resend(apiKey);

    try {
        // Resend returns { data, error } instead of throwing, so check both.
        const { error } = await resend.emails.send({
            from: sender,
            to: Array.isArray(to) ? to : [to],
            replyTo: STAFF_INBOX,
            subject,
            text: message
        });

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error("Booking portal email notification failed.", {
            name: error && error.name,
            message: error && error.message
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