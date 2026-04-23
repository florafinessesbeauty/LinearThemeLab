// C:\Projects\LinearThemeLab\server\src\services\storageService.ts
import { s3Client } from "../config/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

import { buildThemeZip, type ThemeFile } from "@linearthemelab/shared";

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadThemeZip(
  id: string,
  files: ThemeFile[]
): Promise<UploadResult> {
  // Build ZIP buffer using shared ZIP builder
  const zipBuffer = await buildThemeZip(files);

  const key = `themes/${id}.zip`;

  // LOCAL FALLBACK (no S3 configured)
  if (!env.S3_BUCKET_NAME) {
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
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: zipBuffer,
      ContentType: "application/zip",
    })
  );

  return {
    key,
    url: `${env.CDN_URL}/${key}`,
  };
}

export function createThemeId(): string {
  return randomUUID();
}
