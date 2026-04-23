import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");

  if (!themeId) {
    return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
  }

  const url = new URL(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/files`
  );
  url.searchParams.set("themeId", themeId);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
