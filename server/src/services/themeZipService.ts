import { uploadThemeZip } from "./storageService";
import { listThemeFiles, getThemeFile } from "./themeFileService";

export async function rebuildThemeZip(themeId: string) {
  const entries = listThemeFiles(themeId);
  const files = [] as { path: string; contents: string }[];

  for (const f of entries) {
    const contents = getThemeFile(themeId, f.path);
    if (contents === null) continue;
    files.push({ path: f.path, contents });
  }

  const { url, key } = await uploadThemeZip(themeId, files);
  return { url, key };
}
