import type { ThemePlatform } from "./platformRegistry";

export const NICHE_REGISTRY: Record<ThemePlatform, string[]> = {
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

export type ThemeFileMap = Record<string, string>;

export const SHOPIFY_THEME_FILES: ThemeFileMap = {
  "layout/theme.liquid": "Main layout wrapper",
  "sections/hero.liquid": "Hero section markup",
  "sections/hero.json": "Hero section schema"
};

export const WOOCOMMERCE_THEME_FILES: ThemeFileMap = {
  "style.css": "Main theme stylesheet",
  "index.php": "Theme entry template",
  "functions.php": "Theme bootstrap and WooCommerce support"
};

export function getThemeFilesForPlatform(platform: ThemePlatform): ThemeFileMap {
  if (platform === "shopify") return SHOPIFY_THEME_FILES;
  if (platform === "woocommerce") return WOOCOMMERCE_THEME_FILES;
  return {};
}
