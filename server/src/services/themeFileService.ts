import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.join(process.cwd(), "themes");

export function ensureThemeDir(themeId: string) {
  const dir = path.join(ROOT, themeId, "files");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function listThemeFiles(themeId: string) {
  const dir = ensureThemeDir(themeId);

  function walk(current: string, base = ""): any[] {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    let files: any[] = [];

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = path.join(base, entry.name);

      if (entry.isDirectory()) {
        files = files.concat(walk(full, rel));
      } else {
        const stat = fs.statSync(full);
        files.push({ path: rel.replace(/\\/g, "/"), size: stat.size });
      }
    }
    return files;
  }

  return walk(dir);
}

export function getThemeFile(themeId: string, filePath: string) {
  const dir = ensureThemeDir(themeId);
  const full = path.join(dir, filePath);

  if (!fs.existsSync(full)) return null;

  return fs.readFileSync(full, "utf-8");
}

export function saveThemeFile(themeId: string, filePath: string, contents: string) {
  const dir = ensureThemeDir(themeId);
  const full = path.join(dir, filePath);

  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents, "utf-8");

  return true;
}
