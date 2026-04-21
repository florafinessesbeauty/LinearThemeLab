import { uploadThemeZip } from "./storageService";
import { listThemeFiles, getThemeFile } from "./themeFileService";

export async function rebuildThemeZip(themeId: string) {
  const files = listThemeFiles(themeId);
  const fileMap: Record<string, string> = {};

  for (const f of files) {
    fileMap[f.path] = getThemeFile(themeId, f.path);
  }

  const { url, key } = await uploadThemeZip(themeId, fileMap);
  return { url, key };
}
