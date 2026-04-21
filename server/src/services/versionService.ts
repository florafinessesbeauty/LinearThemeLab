import * as fs from "node:fs";
import * as path from "node:path";
import { saveThemeFile, getThemeFile } from "./themeFileService";

const ROOT = path.join(process.cwd(), "theme_versions");

export function saveVersionEntry(themeId: string, filePath: string, old: string, updated: string) {
  const dir = path.join(ROOT, themeId);
  fs.mkdirSync(dir, { recursive: true });

  const entry = {
    path: filePath,
    old,
    new: updated,
    timestamp: Date.now()
  };

  const file = path.join(dir, `${entry.timestamp}.json`);
  fs.writeFileSync(file, JSON.stringify(entry, null, 2));
}

export function listVersions(themeId: string) {
  const dir = path.join(ROOT, themeId);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).map((f) => {
    const full = path.join(dir, f);
    const data = JSON.parse(fs.readFileSync(full, "utf-8"));
    return data;
  }).sort((a, b) => b.timestamp - a.timestamp);
}

export function restoreVersion(themeId: string, timestamp: number) {
  const dir = path.join(ROOT, themeId);
  const file = path.join(dir, `${timestamp}.json`);
  if (!fs.existsSync(file)) return null;

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  saveThemeFile(themeId, data.path, data.old);
  return data;
}
