module.exports = {
  validateShopifyTheme(theme) {
    const errors = [];
    if (!theme.files["layout/theme.liquid"]) {
      errors.push("Missing layout/theme.liquid");
    }
    if (!theme.files["sections/hero.liquid"]) {
      errors.push("Missing sections/hero.liquid");
    }
    return errors;
  }
};
