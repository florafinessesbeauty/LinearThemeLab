import { z } from "zod";

export const themeRequestSchema = z.object({
  niche: z.string().min(2),
  goal: z.string().min(4),
  platform: z.enum(["shopify", "woocommerce"])
});

export type ThemeRequest = z.infer<typeof themeRequestSchema>;
