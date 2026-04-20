"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themesRouter = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const copilotThemeService_js_1 = require("../services/copilotThemeService.js");
const storageService_js_1 = require("../services/storageService.js");
const userService_js_1 = require("../services/userService.js");
exports.themesRouter = (0, express_1.Router)();
exports.themesRouter.post("/generate", auth_js_1.requireAuth, async (req, res) => {
    const { niche, goal, platform } = req.body;
    const theme = await (0, copilotThemeService_js_1.generateThemeWithCopilot)(platform, niche, goal);
    const id = (0, storageService_js_1.createThemeId)();
    const upload = await (0, storageService_js_1.uploadThemeZip)(id, theme.files);
    const record = {
        id,
        platform,
        niche,
        goal,
        s3Key: upload.key,
        createdAt: new Date().toISOString()
    };
    (0, userService_js_1.addUserTheme)(req.user.id, record);
    res.json(record);
});
exports.themesRouter.get("/list", auth_js_1.requireAuth, (req, res) => {
    const themes = (0, userService_js_1.listUserThemes)(req.user.id);
    res.json({ themes });
});
exports.themesRouter.get("/preview", auth_js_1.requireAuth, (req, res) => {
    const { id } = req.query;
    const theme = (0, userService_js_1.getThemeById)(req.user.id, id);
    if (!theme)
        return res.status(404).send("Theme not found");
    res.send(`
    <html>
      <body style="background:#0d0d0f;color:#e5e7eb;">
        <h1>Preview for theme ${id}</h1>
        <p>Platform: ${theme.platform}</p>
        <p>Niche: ${theme.niche}</p>
        <p>Goal: ${theme.goal}</p>
      </body>
    </html>
  `);
});
