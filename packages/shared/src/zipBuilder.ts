import JSZip from "jszip";
import type { ThemeFile } from "./platformRegistry";

export async function buildThemeZip(files: ThemeFile[]): Promise<Buffer> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.contents);
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });
  return content;
}
