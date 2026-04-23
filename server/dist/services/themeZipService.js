"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildThemeZip = rebuildThemeZip;
const storageService_1 = require("./storageService");
const themeFileService_1 = require("./themeFileService");
async function rebuildThemeZip(themeId) {
    const entries = (0, themeFileService_1.listThemeFiles)(themeId);
    const files = [];
    for (const f of entries) {
        const contents = (0, themeFileService_1.getThemeFile)(themeId, f.path);
        if (contents === null)
            continue;
        files.push({ path: f.path, contents });
    }
    const { url, key } = await (0, storageService_1.uploadThemeZip)(themeId, files);
    return { url, key };
}
