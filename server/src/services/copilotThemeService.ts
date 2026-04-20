import {
  ShopifyAdapter,
  WooCommerceAdapter,
  buildThemeZip,
  createThemeManifest,
  ThemePlatform
} from "@linearthemelab/shared";

export async function generateThemeWithAdapters(
  platform: ThemePlatform,
  niche: string,
  goal: string
) {
  let adapter;

  if (platform === "shopify") adapter = ShopifyAdapter;
  else if (platform === "woocommerce") adapter = WooCommerceAdapter;
  else throw new Error(`Unsupported platform: ${platform}`);

  // Generate theme files
  const files = adapter.generateFiles({ niche, goal });

  // Build ZIP buffer
  const zipBuffer = await buildThemeZip(files);

  // Create manifest
  const manifest = createThemeManifest({
    id: "", // filled later by route
    platform,
    niche,
    goal
  });

  return {
    files,
    zipBuffer,
    manifest
  };
}
