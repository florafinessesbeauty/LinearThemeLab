"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WOOCOMMERCE_THEME_FILES = exports.SHOPIFY_THEME_FILES = exports.NICHE_REGISTRY = void 0;
exports.getThemeFilesForPlatform = getThemeFilesForPlatform;
exports.NICHE_REGISTRY = {
    shopify: [
        "fashion-boutique",
        "beauty-cosmetics",
        "home-decor",
        "electronics-retail"
    ],
    woocommerce: [
        "wholesale-electronics",
        "b2b-supplies",
        "pet-products",
        "health-supplements"
    ]
};
exports.SHOPIFY_THEME_FILES = {
    "layout/theme.liquid": "Main layout wrapper",
    "sections/hero.liquid": "Hero section markup",
    "sections/hero.json": "Hero section schema"
};
exports.WOOCOMMERCE_THEME_FILES = {
    "style.css": "Main theme stylesheet",
    "index.php": "Theme entry template",
    "functions.php": "Theme bootstrap and WooCommerce support"
};
function getThemeFilesForPlatform(platform) {
    if (platform === "shopify")
        return exports.SHOPIFY_THEME_FILES;
    if (platform === "woocommerce")
        return exports.WOOCOMMERCE_THEME_FILES;
    return {};
}
