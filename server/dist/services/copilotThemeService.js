"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThemeWithAdapters = generateThemeWithAdapters;
const shared_1 = require("@linearthemelab/shared");
async function generateThemeWithAdapters(platform, niche, goal) {
    let adapter;
    if (platform === "shopify")
        adapter = shared_1.ShopifyAdapter;
    else if (platform === "woocommerce")
        adapter = shared_1.WooCommerceAdapter;
    else
        throw new Error(`Unsupported platform: ${platform}`);
    // Generate theme files
    const files = adapter.generateFiles({ niche, goal });
    // Build ZIP buffer
    const zipBuffer = await (0, shared_1.buildThemeZip)(files);
    // Manifest (ID added later in route)
    const manifest = (0, shared_1.createThemeManifest)({
        id: "",
        platform,
        niche,
        goal
    });
    return {
        files,
        zipBuffer,
        manifest
    };
}
