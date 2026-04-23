import { slugify } from "../utils/slug";
export function generateWooThemeFiles(niche, goal) {
    const slug = `${slugify(niche)}-woo-theme`;
    const styleCss = `/*
Theme Name: ${niche} – WooCommerce
Theme URI: https://linearthemelab.example
Description: ${goal}
Author: LinearThemeLab
Version: 1.0.0
Text Domain: ${slug}
*/
body {
  background: #050816;
  color: #e5e7eb;
}
`;
    const functionsPhp = `<?php
/*
 * Theme bootstrap for ${niche} – WooCommerce
 */

function ${slug}_setup() {
  add_theme_support('woocommerce');
}
add_action('after_setup_theme', '${slug}_setup');
`;
    const indexPhp = `<?php get_header(); ?>
<main id="primary" class="site-main">
  <h1>${niche} – ${goal}</h1>
  <p>Welcome to your LinearThemeLab WooCommerce theme.</p>
</main>
<?php get_footer(); ?>
`;
    return [
        {
            path: "style.css",
            contents: styleCss
        },
        {
            path: "functions.php",
            contents: functionsPhp
        },
        {
            path: "index.php",
            contents: indexPhp
        }
    ];
}
export const WooCommerceAdapter = {
    id: "woocommerce",
    label: "WooCommerce",
    generateFiles: ({ niche, goal }) => generateWooThemeFiles(niche, goal)
};
