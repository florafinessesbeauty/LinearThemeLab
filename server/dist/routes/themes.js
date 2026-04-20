"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themesRouter = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const copilotThemeService_js_1 = require("../services/copilotThemeService.js");
const storageService_js_1 = require("../services/storageService.js");
const userService_js_1 = require("../services/userService.js");
const shared_1 = require("@linearthemelab/shared");
exports.themesRouter = (0, express_1.Router)();
/**
 * POST /themes/generate
 * Generate a theme using Copilot + shared validation + metadata registry
 */
exports.themesRouter.post("/generate", auth_js_1.requireAuth, async (req, res) => {
    try {
        // Validate incoming body using shared schema
        const parsed = shared_1.ThemeGenerateRequestSchema.parse(req.body);
        // Validate niche is allowed for the selected platform
        const allowedNiches = shared_1.NICHE_REGISTRY[parsed.platform];
        if (!allowedNiches.includes(parsed.niche)) {
            return res.status(400).json({
                error: `Unsupported niche '${parsed.niche}' for platform '${parsed.platform}'`
            });
        }
        // Generate theme using Copilot
        const theme = await (0, copilotThemeService_js_1.generateThemeWithCopilot)(parsed.platform, parsed.niche, parsed.goal);
        // Create ID + upload ZIP to S3
        const id = (0, storageService_js_1.createThemeId)();
        const upload = await (0, storageService_js_1.uploadThemeZip)(id, theme.files);
        // Build theme record
        const record = {
            id,
            platform: parsed.platform,
            niche: parsed.niche,
            goal: parsed.goal,
            s3Key: upload.key,
            createdAt: new Date().toISOString()
        };
        // Validate record using shared schema
        const validatedRecord = shared_1.ThemeRecordSchema.parse(record);
        // Save to user
        (0, userService_js_1.addUserTheme)(req.user.id, validatedRecord);
        return res.json(validatedRecord);
    }
    catch (err) {
        console.error("Theme generation error:", err);
        return res.status(500).json({ error: "Theme generation failed" });
    }
});
/**
 * GET /themes/list
 * List themes for the authenticated user
 */
exports.themesRouter.get("/list", auth_js_1.requireAuth, (req, res) => {
    const themes = (0, userService_js_1.listUserThemes)(req.user.id);
    res.json({ themes });
});
/**
 * GET /themes/preview?id=123
 * Simple HTML preview of a theme
 */
exports.themesRouter.get("/preview", auth_js_1.requireAuth, (req, res) => {
    const { id } = req.query;
    const theme = (0, userService_js_1.getThemeById)(req.user.id, id);
    if (!theme) {
        return res.status(404).send("Theme not found");
    }
    res.send(`
    <html>
      <body style="background:#0d0d0f;color:#e5e7eb;font-family:sans-serif;padding:20px;">
        <h1>Preview for theme ${id}</h1>
        <p><strong>Platform:</strong> ${theme.platform}</p>
        <p><strong>Niche:</strong> ${theme.niche}</p>
        <p><strong>Goal:</strong> ${theme.goal}</p>
      </body>
    </html>
  `);
});
