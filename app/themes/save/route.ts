import { NextResponse } from "next/server";
import { saveThemeFile, getThemeFile } from "@/server/src/services/themeFileService";
import { saveVersionEntry } from "@/server/src/services/versionService";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, path, contents } = body;

  if (!themeId || !path)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const old = getThemeFile(themeId, path) || "";

  saveThemeFile(themeId, path, contents);

  // version history
  saveVersionEntry(themeId, path, old, contents);

  return NextResponse.json({ success: true });
}
