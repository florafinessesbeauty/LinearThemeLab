module.exports = {
  validateWooTheme(theme) {
    const errors = [];
    if (!theme.files["functions.php"]) {
      errors.push("Missing functions.php");
    }
    if (!theme.files["index.php"]) {
      errors.push("Missing index.php");
    }
    return errors;
  }
};
