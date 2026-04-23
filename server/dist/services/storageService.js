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
exports.uploadThemeZip = uploadThemeZip;
exports.createThemeId = createThemeId;
// C:\Projects\LinearThemeLab\server\src\services\storageService.ts
const s3_1 = require("../config/s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../config/env");
const node_crypto_1 = require("node:crypto");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const shared_1 = require("@linearthemelab/shared");
async function uploadThemeZip(id, files) {
    // Build ZIP buffer using shared ZIP builder
    const zipBuffer = await (0, shared_1.buildThemeZip)(files);
    const key = `themes/${id}.zip`;
    // LOCAL FALLBACK (no S3 configured)
    if (!env_1.env.S3_BUCKET_NAME) {
        const outDir = path.join(process.cwd(), "tmp", "themes");
        fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(outDir, `${id}.zip`);
        fs.writeFileSync(outPath, zipBuffer);
        return {
            key: outPath,
            url: `file://${outPath}`,
        };
    }
    // UPLOAD TO S3
    await s3_1.s3Client.send(new client_s3_1.PutObjectCommand({
        Bucket: env_1.env.S3_BUCKET_NAME,
        Key: key,
        Body: zipBuffer,
        ContentType: "application/zip",
    }));
    return {
        key,
        url: `${env_1.env.CDN_URL}/${key}`,
    };
}
function createThemeId() {
    return (0, node_crypto_1.randomUUID)();
}
