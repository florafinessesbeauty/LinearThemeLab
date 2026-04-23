// C:\Projects\LinearThemeLab\server\src\routes\themes.ts
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { uploadThemeZip, createThemeId } from "../services/storageService.js";
import { addUserTheme } from "../services/userService.js";

import {
  ThemeGenerateRequestSchema,
  ThemeGenerateResponseSchema,
  NICHE_REGISTRY
} from "@linearthemelab/shared";

import { generateThemeWithAdapters } from "../services/copilotThemeService.js";

export const themesRouter = Router();

themesRouter.post(
  "/generate",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const parsed = ThemeGenerateRequestSchema.parse(req.body);

      const allowedNiches = NICHE_REGISTRY[parsed.platform];
      if (!allowedNiches.includes(parsed.niche)) {
        return res.status(400).json({
          error: `Unsupported niche '${parsed.niche}' for platform '${parsed.platform}'`
        });
      }

      const id = createThemeId();

      // Generate theme using adapters
      const { files, manifest } = await generateThemeWithAdapters(
        parsed.platform,
        parsed.niche,
        parsed.goal
      );

      // Upload ZIP
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

      const validatedRecord = ThemeGenerateResponseSchema.parse(record);

      addUserTheme(req.user!.id, validatedRecord);

      return res.json({
        ...validatedRecord,
        manifest: { ...manifest, id },
        downloadUrl: upload.url
      });
    } catch (err) {
      console.error("Theme generation error:", err);
      return res.status(500).json({ error: "Theme generation failed" });
    }
  }
);
