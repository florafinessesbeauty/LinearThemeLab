export type Platform = "shopify" | "woocommerce";

export interface ThemeMeta {
  niche: string;
  goal: string;
  platform: Platform;
}

export interface GeneratedTheme {
  themeSlug: string;
  files: Record<string, string>;
  meta: ThemeMeta;
}
