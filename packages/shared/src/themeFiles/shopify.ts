import { slugify } from "../utils/slug";
import type { ThemeFile, PlatformAdapter } from "../platformRegistry";

export function generateShopifyThemeFiles(niche: string, goal: string): ThemeFile[] {
  const slug = slugify(`${niche}-${goal}`);

  const layoutThemeLiquid = `<!doctype html>
<html lang="en">
  <head>
    <title>{{ page_title }} – ${niche} – ${goal}</title>
    {{ content_for_header }}
  </head>
  <body class="linear-theme-lab ${slug}">
    {{ content_for_layout }}
  </body>
</html>
`;

  const configSettingsSchema = `[
  {
    "name": "Theme settings",
    "settings": [
      {
        "type": "text",
        "id": "hero_heading",
        "label": "Hero heading",
        "default": "${niche} – ${goal}"
      }
    ]
  }
]
`;

  const sectionsHeroLiquid = `<section class="hero">
  <h1>{{ settings.hero_heading }}</h1>
  <p>${goal}</p>
</section>
`;

  return [
    {
      path: "layout/theme.liquid",
      contents: layoutThemeLiquid
    },
    {
      path: "config/settings_schema.json",
      contents: configSettingsSchema
    },
    {
      path: "sections/hero.liquid",
      contents: sectionsHeroLiquid
    }
  ];
}

export const ShopifyAdapter: PlatformAdapter = {
  id: "shopify",
  label: "Shopify",
  generateFiles: ({ niche, goal }) => generateShopifyThemeFiles(niche, goal)
};
