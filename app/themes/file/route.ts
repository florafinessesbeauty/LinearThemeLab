import { NextResponse } from "next/server";
import { getThemeFile } from "@/server/src/services/themeFileService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");
  const filePath = searchParams.get("path");

  if (!themeId || !filePath)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const contents = getThemeFile(themeId, filePath);
  if (contents === null)
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  return NextResponse.json({ path: filePath, contents });
}
