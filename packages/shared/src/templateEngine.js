"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;

/**
 * Simple template renderer replacing {{ key }} placeholders.
 * @param {string} template
 * @param {Record<string, string>} vars
 * @returns {string}
 */
function renderTemplate(template, vars) {
  return Object.keys(vars).reduce((acc, key) => {
    const pattern = new RegExp(String.raw`{{\s*${key}\s*}}`, "g");
    return acc.replace(pattern, vars[key]);
  }, template);
}
