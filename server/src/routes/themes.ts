import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { generateThemeWithCopilot } from "../services/copilotThemeService.js";
import { uploadThemeZip, createThemeId } from "../services/storageService.js";
import { addUserTheme, listUserThemes, getThemeById } from "../services/userService.js";

import {
  ThemeGenerateRequestSchema,
  ThemeRecordSchema,
  NICHE_REGISTRY
} from "@linearthemelab/shared";

export const themesRouter = Router();

/**
 * POST /themes/generate
 * Generate a theme using Copilot + shared validation + metadata registry
 */
themesRouter.post("/generate", requireAuth, async (req: AuthRequest, res) => {
  try {
    // Validate incoming body using shared schema
    const parsed = ThemeGenerateRequestSchema.parse(req.body);

    // Validate niche is allowed for the selected platform
    const allowedNiches = NICHE_REGISTRY[parsed.platform];
    if (!allowedNiches.includes(parsed.niche)) {
      return res.status(400).json({
        error: `Unsupported niche '${parsed.niche}' for platform '${parsed.platform}'`
      });
    }

    // Generate theme using Copilot
    const theme = await generateThemeWithCopilot(
      parsed.platform,
      parsed.niche,
      parsed.goal
    );

    // Create ID + upload ZIP to S3
    const id = createThemeId();
    const upload = await uploadThemeZip(id, theme.files);

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
    const validatedRecord = ThemeRecordSchema.parse(record);

    // Save to user
    addUserTheme(req.user!.id, validatedRecord);

    return res.json(validatedRecord);
  } catch (err) {
    console.error("Theme generation error:", err);
    return res.status(500).json({ error: "Theme generation failed" });
  }
});

/**
 * GET /themes/list
 * List themes for the authenticated user
 */
themesRouter.get("/list", requireAuth, (req: AuthRequest, res) => {
  const themes = listUserThemes(req.user!.id);
  res.json({ themes });
});

/**
 * GET /themes/preview?id=123
 * Simple HTML preview of a theme
 */
themesRouter.get("/preview", requireAuth, (req: AuthRequest, res) => {
  const { id } = req.query as any;
  const theme = getThemeById(req.user!.id, id);

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
