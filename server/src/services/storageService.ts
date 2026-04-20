import { s3Client } from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config/env.js";
import { randomUUID } from "crypto";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function uploadThemeZip(
  themeId: string,
  files: Record<string, string>
) {
  const zip = new JSZip();
  for (const [filePath, content] of Object.entries(files)) {
    zip.file(filePath, content);
  }
  const buffer = await zip.generateAsync({ type: "nodebuffer" });

  const key = `themes/${themeId}.zip`;

  // If S3 is not configured, write the zip to a local tmp directory and return a file URL.
  if (!env.S3_BUCKET_NAME) {
    const outDir = path.join(process.cwd(), "tmp", "themes");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${themeId}.zip`);
    fs.writeFileSync(outPath, buffer);
    return { key: outPath, url: `file://${outPath}` };
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "application/zip"
    })
  );

  return { key, url: `s3://${env.S3_BUCKET_NAME}/${key}` };
}

export function createThemeId() {
  return randomUUID();
}
