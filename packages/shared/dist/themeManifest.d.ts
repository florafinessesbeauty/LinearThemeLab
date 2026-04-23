import type { ThemePlatform } from "./platformRegistry";
export interface ThemeManifest {
    id: string;
    name: string;
    platform: ThemePlatform;
    niche: string;
    goal: string;
    version: string;
    createdAt: string;
}
export declare function createThemeManifest(input: {
    id: string;
    platform: ThemePlatform;
    niche: string;
    goal: string;
}): ThemeManifest;
//# sourceMappingURL=themeManifest.d.ts.map