import { NextResponse } from "next/server";
import { restoreVersion } from "@server/services/versionService";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, path, versionId } = body;

  if (!themeId || !path || !versionId) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  // restoreVersion only accepts (themeId, versionId)
  const restored = restoreVersion(themeId, versionId);

  if (!restored) {
    return NextResponse.json(
      { error: "Version not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, restored });
}
