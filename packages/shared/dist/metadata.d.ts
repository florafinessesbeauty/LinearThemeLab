import type { ThemePlatform } from "./platformRegistry";
export declare const NICHE_REGISTRY: Record<ThemePlatform, string[]>;
export type ThemeFileMap = Record<string, string>;
export declare const SHOPIFY_THEME_FILES: ThemeFileMap;
export declare const WOOCOMMERCE_THEME_FILES: ThemeFileMap;
export declare function getThemeFilesForPlatform(platform: ThemePlatform): ThemeFileMap;
//# sourceMappingURL=metadata.d.ts.map