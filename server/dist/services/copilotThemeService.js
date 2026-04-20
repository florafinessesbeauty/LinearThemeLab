"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThemeWithCopilot = generateThemeWithCopilot;
const shopifyGenerator_js_1 = require("./shopifyGenerator.js");
const woocommerceGenerator_js_1 = require("./woocommerceGenerator.js");
async function generateThemeWithCopilot(platform, niche, goal) {
    if (platform === "shopify") {
        return (0, shopifyGenerator_js_1.generateShopifyTheme)(niche, goal);
    }
    return (0, woocommerceGenerator_js_1.generateWooTheme)(niche, goal);
}
