export type ThemePlatform = "shopify" | "woocommerce";

export interface PlatformDefinition {
  id: ThemePlatform;
  label: string;
  supportsZip: boolean;
}

export const PLATFORM_REGISTRY: Record<ThemePlatform, PlatformDefinition> = {
  shopify: {
    id: "shopify",
    label: "Shopify",
    supportsZip: true
  },
  woocommerce: {
    id: "woocommerce",
    label: "WooCommerce",
    supportsZip: true
  }
};

export interface ThemeFile {
  path: string;
  contents: string;
}

export interface PlatformAdapter {
  id: ThemePlatform;
  label: string;
  generateFiles(input: {
    niche: string;
    goal: string;
  }): ThemeFile[];
}
