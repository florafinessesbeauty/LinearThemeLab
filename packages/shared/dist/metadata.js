export const NICHE_REGISTRY = {
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
export const SHOPIFY_THEME_FILES = {
    "layout/theme.liquid": "Main layout wrapper",
    "sections/hero.liquid": "Hero section markup",
    "sections/hero.json": "Hero section schema"
};
export const WOOCOMMERCE_THEME_FILES = {
    "style.css": "Main theme stylesheet",
    "index.php": "Theme entry template",
    "functions.php": "Theme bootstrap and WooCommerce support"
};
export function getThemeFilesForPlatform(platform) {
    if (platform === "shopify")
        return SHOPIFY_THEME_FILES;
    if (platform === "woocommerce")
        return WOOCOMMERCE_THEME_FILES;
    return {};
}
