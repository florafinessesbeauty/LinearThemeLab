import { NextResponse } from "next/server";
import { getThemeFile, saveThemeFile } from "@server/services/themeFileService";
import { saveVersionEntry } from "@server/services/versionService";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, path, contents } = body;

  if (!themeId || !path) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const old = getThemeFile(themeId, path) || "";

  saveThemeFile(themeId, path, contents);
  saveVersionEntry(themeId, path, old, contents);

  return NextResponse.json({ success: true });
}
