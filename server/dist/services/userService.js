"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserTheme = addUserTheme;
exports.listUserThemes = listUserThemes;
exports.getThemeById = getThemeById;
const themesByUser = {};
function addUserTheme(userId, theme) {
    if (!themesByUser[userId])
        themesByUser[userId] = [];
    themesByUser[userId].push(theme);
}
function listUserThemes(userId) {
    return themesByUser[userId] || [];
}
function getThemeById(userId, themeId) {
    return (themesByUser[userId] || []).find((t) => t.id === themeId);
}
