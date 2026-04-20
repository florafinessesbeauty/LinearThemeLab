"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeRecordSchema = exports.ThemeGenerateResponseSchema = exports.ThemeGenerateRequestSchema = void 0;
const zod_1 = require("zod");
exports.ThemeGenerateRequestSchema = zod_1.z.object({
    platform: zod_1.z.enum(["shopify", "woocommerce"]),
    niche: zod_1.z.string().min(1),
    goal: zod_1.z.string().min(1)
});
exports.ThemeGenerateResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    platform: zod_1.z.enum(["shopify", "woocommerce"]),
    niche: zod_1.z.string(),
    goal: zod_1.z.string(),
    s3Key: zod_1.z.string(),
    createdAt: zod_1.z.string()
});
exports.ThemeRecordSchema = exports.ThemeGenerateResponseSchema;
