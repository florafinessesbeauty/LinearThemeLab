import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");
  const filePath = searchParams.get("path");

  if (!themeId || !filePath) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const url = new URL(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/file`
  );
  url.searchParams.set("themeId", themeId);
  url.searchParams.set("path", filePath);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    return NextResponse.json(
      { error: "File not found" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
