import { NextResponse } from "next/server";
import { restoreVersion } from "@/server/src/services/versionService";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, timestamp } = body;

  if (!themeId || !timestamp)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const restored = restoreVersion(themeId, timestamp);
  if (!restored) return NextResponse.json({ error: "Version not found" }, { status: 404 });

  return NextResponse.json({ restored });
}
