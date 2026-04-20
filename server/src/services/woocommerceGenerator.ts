export function generateWooTheme(niche: string, goal: string) {
  // Safe version: replace() with regex replaces ALL matches
  const themeSlug = `${niche.replace(/\s+/g, "-").toLowerCase()}-woo-theme`;

  const functionsPhp = `<?php
/*
Theme Name: ${niche} Woo Theme
Description: Auto‑generated WooCommerce theme focused on ${goal}.
*/

function ${themeSlug}_setup() {
  add_theme_support('woocommerce');
}
add_action('after_setup_theme', '${themeSlug}_setup');
`;

  const indexPhp = `<?php get_header(); ?>
<main>
  <h1>${niche} Storefront</h1>
  <?php woocommerce_content(); ?>
</main>
<?php get_footer(); ?>
`;

  return {
    themeSlug,
    files: {
      "functions.php": functionsPhp,
      "index.php": indexPhp,
      "style.css": `/* ${niche} Woo Theme */`
    },
    meta: { niche, goal, platform: "woocommerce" }
  };
}
