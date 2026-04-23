// C:\Projects\LinearThemeLab\server\src\services\versionService.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { saveThemeFile } from "./themeFileService";

const ROOT = path.join(process.cwd(), "theme_versions");

interface VersionEntry {
  path: string;
  old: string;
  new: string;
  timestamp: number;
}

export function saveVersionEntry(
  themeId: string,
  filePath: string,
  old: string,
  updated: string
): void {
  const dir = path.join(ROOT, themeId);
  fs.mkdirSync(dir, { recursive: true });

  const entry: VersionEntry = {
    path: filePath,
    old,
    new: updated,
    timestamp: Date.now(),
  };

  const file = path.join(dir, `${entry.timestamp}.json`);
  fs.writeFileSync(file, JSON.stringify(entry, null, 2));
}

export function listVersions(themeId: string): VersionEntry[] {
  const dir = path.join(ROOT, themeId);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .map((f) => {
      const full = path.join(dir, f);
      const data = JSON.parse(fs.readFileSync(full, "utf-8")) as VersionEntry;
      return data;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function restoreVersion(
  themeId: string,
  timestamp: number
): VersionEntry | null {
  const dir = path.join(ROOT, themeId);
  const file = path.join(dir, `${timestamp}.json`);
  if (!fs.existsSync(file)) return null;

  const data = JSON.parse(fs.readFileSync(file, "utf-8")) as VersionEntry;
  saveThemeFile(themeId, data.path, data.old);
  return data;
}
