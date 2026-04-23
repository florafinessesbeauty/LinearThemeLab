"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiSuggestion = getAiSuggestion;
const env_js_1 = require("../config/env.js");
async function getAiSuggestion(opts) {
    const { code, language, goal } = opts;
    if (!env_js_1.env.COPILOT_API_KEY) {
        // Fallback: keep behavior safe if key is missing
        return `/* AI disabled — missing COPILOT_API_KEY */\n` + code;
    }
    // You can shape this payload to match your actual Copilot backend
    const payload = {
        code,
        language,
        goal,
        // You can add more metadata here (file path, themeId, etc.)
    };
    const res = await fetch(env_js_1.env.COPILOT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env_js_1.env.COPILOT_API_KEY}`,
            "X-Copilot-Org": env_js_1.env.COPILOT_ORG_ID || ""
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return `/* AI error: ${res.status} ${res.statusText}\n${text} */\n` + code;
    }
    const data = await res.json().catch(() => ({}));
    // Adjust this depending on your backend’s response shape
    const suggestion = data.suggestion ||
        data.code ||
        data.result ||
        `/* AI returned no suggestion */\n` + code;
    return suggestion;
}
