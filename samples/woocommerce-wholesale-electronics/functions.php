<?php
/*
Theme Name: Wholesale Electronics Pro
Description: High‑conversion wholesale electronics WooCommerce theme.
*/

function wholesaleElectronicsProSetup() {
  add_theme_support('woocommerce');
  add_theme_support('title-tag');
}
add_action('after_setup_theme', 'wholesaleElectronicsProSetup');
