"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThemeRequest = validateThemeRequest;
const themeSchemas_1 = require("./themeSchemas");
function validateThemeRequest(input) {
    return themeSchemas_1.ThemeGenerateRequestSchema.parse(input);
}
