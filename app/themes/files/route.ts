import { NextResponse } from "next/server";
import { listThemeFiles } from "@server/services/themeFileService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");

  if (!themeId) {
    return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
  }

  const files = listThemeFiles(themeId);
  return NextResponse.json({ files });
}
