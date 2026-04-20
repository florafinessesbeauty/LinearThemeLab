import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { generateThemeWithCopilot } from "../services/copilotThemeService.js";
import { uploadThemeZip, createThemeId } from "../services/storageService.js";
import { addUserTheme, listUserThemes, getThemeById } from "../services/userService.js";

import {
  ThemeGenerateRequestSchema,
  ThemeRecordSchema
} from "@linearthemelab/shared";

export const themesRouter = Router();

themesRouter.post("/generate", requireAuth, async (req: AuthRequest, res) => {
  // Validate request using shared schema
  const parsed = ThemeGenerateRequestSchema.parse(req.body);

  const theme = await generateThemeWithCopilot(
    parsed.platform,
    parsed.niche,
    parsed.goal
  );

  const id = createThemeId();
  const upload = await uploadThemeZip(id, theme.files);

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

  addUserTheme(req.user!.id, validatedRecord);

  res.json(validatedRecord);
});

themesRouter.get("/list", requireAuth, (req: AuthRequest, res) => {
  const themes = listUserThemes(req.user!.id);
  res.json({ themes });
});

themesRouter.get("/preview", requireAuth, (req: AuthRequest, res) => {
  const { id } = req.query as any;
  const theme = getThemeById(req.user!.id, id);
  if (!theme) return res.status(404).send("Theme not found");

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
