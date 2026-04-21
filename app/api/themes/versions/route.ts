import { NextResponse } from "next/server";
import { listVersions } from "@/server/src/services/versionService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");

  if (!themeId) return NextResponse.json({ error: "Missing themeId" }, { status: 400 });

  const versions = listVersions(themeId);
  return NextResponse.json({ versions });
}
