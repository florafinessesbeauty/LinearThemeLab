"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadThemeZip = uploadThemeZip;
exports.createThemeId = createThemeId;
const s3_js_1 = require("../config/s3.js");
const client_s3_1 = require("@aws-sdk/client-s3");
const env_js_1 = require("../config/env.js");
const crypto_1 = require("crypto");
const jszip_1 = __importDefault(require("jszip"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function uploadThemeZip(themeId, files) {
    const zip = new jszip_1.default();
    for (const [filePath, content] of Object.entries(files)) {
        zip.file(filePath, content);
    }
    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    const key = `themes/${themeId}.zip`;
    // If S3 is not configured, write the zip to a local tmp directory and return a file URL.
    if (!env_js_1.env.S3_BUCKET_NAME) {
        const outDir = path_1.default.join(process.cwd(), "tmp", "themes");
        fs_1.default.mkdirSync(outDir, { recursive: true });
        const outPath = path_1.default.join(outDir, `${themeId}.zip`);
        fs_1.default.writeFileSync(outPath, buffer);
        return { key: outPath, url: `file://${outPath}` };
    }
    await s3_js_1.s3Client.send(new client_s3_1.PutObjectCommand({
        Bucket: env_js_1.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "application/zip"
    }));
    return { key, url: `s3://${env_js_1.env.S3_BUCKET_NAME}/${key}` };
}
function createThemeId() {
    return (0, crypto_1.randomUUID)();
}
