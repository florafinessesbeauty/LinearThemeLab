export type ThemePlatform = "shopify" | "woocommerce";

export interface ThemeManifest {
  id: string;
  name: string;
  platform: ThemePlatform;
  niche: string;
  goal: string;
  version: string;
  createdAt: string;
}

export function createThemeManifest(input: {
  id: string;
  platform: ThemePlatform;
  niche: string;
  goal: string;
}): ThemeManifest {
  return {
    id: input.id,
    name: `${input.niche} – ${input.platform} theme`,
    platform: input.platform,
    niche: input.niche,
    goal: input.goal,
    version: "1.0.0",
    createdAt: new Date().toISOString()
  };
}
