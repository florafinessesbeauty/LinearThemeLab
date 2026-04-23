"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveVersionEntry = saveVersionEntry;
exports.listVersions = listVersions;
exports.restoreVersion = restoreVersion;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const themeFileService_1 = require("./themeFileService");
const ROOT = path.join(process.cwd(), "theme_versions");
function saveVersionEntry(themeId, filePath, old, updated) {
    const dir = path.join(ROOT, themeId);
    fs.mkdirSync(dir, { recursive: true });
    const entry = {
        path: filePath,
        old,
        new: updated,
        timestamp: Date.now()
    };
    const file = path.join(dir, `${entry.timestamp}.json`);
    fs.writeFileSync(file, JSON.stringify(entry, null, 2));
}
function listVersions(themeId) {
    const dir = path.join(ROOT, themeId);
    if (!fs.existsSync(dir))
        return [];
    return fs.readdirSync(dir).map((f) => {
        const full = path.join(dir, f);
        const data = JSON.parse(fs.readFileSync(full, "utf-8"));
        return data;
    }).sort((a, b) => b.timestamp - a.timestamp);
}
function restoreVersion(themeId, timestamp) {
    const dir = path.join(ROOT, themeId);
    const file = path.join(dir, `${timestamp}.json`);
    if (!fs.existsSync(file))
        return null;
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    (0, themeFileService_1.saveThemeFile)(themeId, data.path, data.old);
    return data;
}
