import { z } from "zod";
export const ThemeGenerateRequestSchema = z.object({
    platform: z.enum(["shopify", "woocommerce"]),
    niche: z.string().min(1),
    goal: z.string().min(1)
});
export const ThemeGenerateResponseSchema = z.object({
    id: z.string(),
    platform: z.enum(["shopify", "woocommerce"]),
    niche: z.string(),
    goal: z.string(),
    s3Key: z.string(),
    createdAt: z.string()
});
export const ThemeRecordSchema = ThemeGenerateResponseSchema;
