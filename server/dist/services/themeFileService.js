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
exports.ensureThemeDir = ensureThemeDir;
exports.listThemeFiles = listThemeFiles;
exports.getThemeFile = getThemeFile;
exports.saveThemeFile = saveThemeFile;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const ROOT = path.join(process.cwd(), "themes");
function ensureThemeDir(themeId) {
    const dir = path.join(ROOT, themeId, "files");
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}
function listThemeFiles(themeId) {
    const dir = ensureThemeDir(themeId);
    function walk(current, base = "") {
        const entries = fs.readdirSync(current, { withFileTypes: true });
        let files = [];
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            const rel = path.join(base, entry.name);
            if (entry.isDirectory()) {
                files = files.concat(walk(full, rel));
            }
            else {
                const stat = fs.statSync(full);
                files.push({ path: rel.replace(/\\/g, "/"), size: stat.size });
            }
        }
        return files;
    }
    return walk(dir);
}
function getThemeFile(themeId, filePath) {
    const dir = ensureThemeDir(themeId);
    const full = path.join(dir, filePath);
    if (!fs.existsSync(full))
        return null;
    return fs.readFileSync(full, "utf-8");
}
function saveThemeFile(themeId, filePath, contents) {
    const dir = ensureThemeDir(themeId);
    const full = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents, "utf-8");
    return true;
}
