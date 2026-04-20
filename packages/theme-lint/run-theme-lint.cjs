const { validateShopifyTheme } = require("./shopify-rules.cjs");
const { validateWooTheme } = require("./woocommerce-rules.cjs");

function mockShopifyTheme() {
  return {
    files: {
      "layout/theme.liquid": "{% layout 'theme' %}",
      "sections/hero.liquid": "<div>Hero</div>"
    }
  };
}

function mockWooTheme() {
  return {
    files: {
      "functions.php": "<?php // functions ?>",
      "index.php": "<?php // index ?>"
    }
  };
}

const shopifyErrors = validateShopifyTheme(mockShopifyTheme());
const wooErrors = validateWooTheme(mockWooTheme());

if (shopifyErrors.length || wooErrors.length) {
  console.error("Theme lint errors:", { shopifyErrors, wooErrors });
  process.exit(1);
} else {
  console.log("Theme lint passed.");
}
