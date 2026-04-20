"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
function renderTemplate(template, vars) {
    return Object.keys(vars).reduce((acc, key) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        return acc.replace(pattern, vars[key]);
    }, template);
}
