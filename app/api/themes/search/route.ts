import { NextResponse } from "next/server";
import { listThemeFiles, getThemeFile } from "@/server/src/services/themeFileService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");
  const q = searchParams.get("q") || "";

  if (!themeId || !q) {
    return NextResponse.json({ results: [] });
  }

  const files = listThemeFiles(themeId);
  const results: { path: string; line: number; snippet: string }[] = [];

  for (const f of files) {
    const contents = getThemeFile(themeId, f.path);
    if (contents == null) continue;
    const lines = contents.split("\n");
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(q.toLowerCase())) {
        results.push({
          path: f.path,
          line: idx + 1,
          snippet: line.trim().slice(0, 120)
        });
      }
    });
  }

  return NextResponse.json({ results });
}
