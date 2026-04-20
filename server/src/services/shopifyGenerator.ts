export function generateShopifyTheme(niche: string, goal: string) {
  const themeName = `${niche.replace(/\s+/g, "-").toLowerCase()}-shopify-theme`;

  const layoutLiquid = `
{% layout 'theme' %}
{% section 'header' %}
{% section 'hero' %}
{% section 'featured-products' %}
{% section 'footer' %}
`;

  const heroSectionJson = JSON.stringify(
    {
      name: "Hero",
      settings: [
        { id: "heading", type: "text", label: "Heading", default: `${niche} Collection` },
        { id: "subheading", type: "text", label: "Subheading", default: "Curated for style‑driven shoppers." },
        { id: "cta_label", type: "text", label: "CTA Label", default: "Shop Now" }
      ]
    },
    null,
    2
  );

  return {
    themeName,
    files: {
      "layout/theme.liquid": layoutLiquid,
      "sections/hero.liquid": "<div class='hero'>{{ section.settings.heading }}</div>",
      "sections/hero.json": heroSectionJson
    },
    meta: { niche, goal, platform: "shopify" }
  };
}
