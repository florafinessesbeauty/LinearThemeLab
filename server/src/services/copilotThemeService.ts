import { generateShopifyTheme } from "./shopifyGenerator.js";
import { generateWooTheme } from "./woocommerceGenerator.js";

export async function generateThemeWithCopilot(
  platform: "shopify" | "woocommerce",
  niche: string,
  goal: string
) {
  if (platform === "shopify") {
    return generateShopifyTheme(niche, goal);
  }

  return generateWooTheme(niche, goal);
}
