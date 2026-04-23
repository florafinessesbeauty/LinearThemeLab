export type ThemePlatform = "shopify" | "woocommerce";
export interface PlatformDefinition {
    id: ThemePlatform;
    label: string;
    supportsZip: boolean;
}
export declare const PLATFORM_REGISTRY: Record<ThemePlatform, PlatformDefinition>;
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
