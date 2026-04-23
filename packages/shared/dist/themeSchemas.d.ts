import { z } from "zod";
export declare const ThemeGenerateRequestSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        shopify: "shopify";
        woocommerce: "woocommerce";
    }>;
    niche: z.ZodString;
    goal: z.ZodString;
}, z.core.$strip>;
export type ThemeGenerateRequest = z.infer<typeof ThemeGenerateRequestSchema>;
export declare const ThemeGenerateResponseSchema: z.ZodObject<{
    id: z.ZodString;
    platform: z.ZodEnum<{
        shopify: "shopify";
        woocommerce: "woocommerce";
    }>;
    niche: z.ZodString;
    goal: z.ZodString;
    s3Key: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ThemeGenerateResponse = z.infer<typeof ThemeGenerateResponseSchema>;
//# sourceMappingURL=themeSchemas.d.ts.map