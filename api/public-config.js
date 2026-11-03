const { getSettings, jsonResponse } = require("../lib/booking-portal");

module.exports = function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return jsonResponse(res, 405, { error: "Method not allowed." });
    }

    const settings = getSettings();
    return jsonResponse(res, 200, {
        supabaseUrl: settings.supabaseUrl || null,
        supabaseAnonKey: settings.supabaseAnonKey || null,
        staffPortalEnabled: Boolean(settings.hasSupabase && settings.staffEmails.length)
    });
};
