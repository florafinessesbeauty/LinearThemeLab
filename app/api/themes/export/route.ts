import { NextResponse } from "next/server";
import { rebuildThemeZip } from "@server/services/themeZipService";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId } = body;

  if (!themeId) {
    return NextResponse.json(
      { error: "Missing themeId" },
      { status: 400 }
    );
  }

  const { url, key } = await rebuildThemeZip(themeId);

  return NextResponse.json({ url, key });
}
