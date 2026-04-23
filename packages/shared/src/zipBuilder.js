"use strict";

import JSZip from "jszip";

/**
 * Build a ZIP buffer from theme files.
 * @param {Array<{ path: string, contents: string | Buffer }>} files
 * @returns {Promise<Buffer>}
 */
export async function buildThemeZip(files) {
  const zip = new JSZip();

  for (const file of files ?? []) {
    zip.file(file.path, file.contents);
  }

  return zip.generateAsync({ type: "nodebuffer" });
}
