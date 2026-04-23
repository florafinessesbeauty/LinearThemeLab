"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildThemeZip = buildThemeZip;
const jszip_1 = __importDefault(require("jszip"));
async function buildThemeZip(files) {
    const zip = new jszip_1.default();
    for (const file of files) {
        zip.file(file.path, file.contents);
    }
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return content;
}
