"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themesRouter = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const storageService_js_1 = require("../services/storageService.js");
const userService_js_1 = require("../services/userService.js");
const shared_1 = require("@linearthemelab/shared");
const copilotThemeService_js_1 = require("../services/copilotThemeService.js");
exports.themesRouter = (0, express_1.Router)();
exports.themesRouter.post("/generate", auth_js_1.requireAuth, async (req, res) => {
    try {
        const parsed = shared_1.ThemeGenerateRequestSchema.parse(req.body);
        const allowedNiches = shared_1.NICHE_REGISTRY[parsed.platform];
        if (!allowedNiches.includes(parsed.niche)) {
            return res.status(400).json({
                error: `Unsupported niche '${parsed.niche}' for platform '${parsed.platform}'`
            });
        }
        const id = (0, storageService_js_1.createThemeId)();
        // Generate theme using adapters
        const { files, zipBuffer, manifest } = await (0, copilotThemeService_js_1.generateThemeWithAdapters)(parsed.platform, parsed.niche, parsed.goal);
        // Upload ZIP
        const upload = await (0, storageService_js_1.uploadThemeZip)(id, files);
        // Final record
        const record = {
            id,
            platform: parsed.platform,
            niche: parsed.niche,
            goal: parsed.goal,
            s3Key: upload.key,
            createdAt: new Date().toISOString()
        };
        const validatedRecord = shared_1.ThemeRecordSchema.parse(record);
        (0, userService_js_1.addUserTheme)(req.user.id, validatedRecord);
        return res.json({
            ...validatedRecord,
            manifest: { ...manifest, id },
            downloadUrl: upload.url
        });
    }
    catch (err) {
        console.error("Theme generation error:", err);
        return res.status(500).json({ error: "Theme generation failed" });
    }
});
