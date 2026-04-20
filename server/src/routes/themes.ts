import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { uploadThemeZip, createThemeId } from "../services/storageService.js";
import { addUserTheme, listUserThemes, getThemeById } from "../services/userService.js";

import {
  ThemeGenerateRequestSchema,
  ThemeRecordSchema,
  NICHE_REGISTRY
} from "@linearthemelab/shared";

import { generateThemeWithAdapters } from "../services/copilotThemeService.js";

export const themesRouter = Router();

themesRouter.post("/generate", requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = ThemeGenerateRequestSchema.parse(req.body);

    const allowedNiches = NICHE_REGISTRY[parsed.platform];
    if (!allowedNiches.includes(parsed.niche)) {
      return res.status(400).json({
        error: `Unsupported niche '${parsed.niche}' for platform '${parsed.platform}'`
      });
    }

    const id = createThemeId();

    // Generate theme using shared adapters
    const { files, zipBuffer, manifest } = await generateThemeWithAdapters(
      parsed.platform,
      parsed.niche,
      parsed.goal
    );

    // Upload ZIP to S3
    const upload = await uploadThemeZip(id, files);

    // Final record
    const record = {
      id,
      platform: parsed.platform,
      niche: parsed.niche,
      goal: parsed.goal,
      s3Key: upload.key,
      createdAt: new Date().toISOString()
    };

    const validatedRecord = ThemeRecordSchema.parse(record);

    addUserTheme(req.user!.id, validatedRecord);

    return res.json({
      ...validatedRecord,
      manifest,
      downloadUrl: upload.url
    });
  } catch (err) {
    console.error("Theme generation error:", err);
    return res.status(500).json({ error: "Theme generation failed" });
  }
});
