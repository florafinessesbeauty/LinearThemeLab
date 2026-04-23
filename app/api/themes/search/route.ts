import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get("themeId");
  const q = searchParams.get("q") || "";

  if (!themeId || !q) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/search`
  );
  url.searchParams.set("themeId", themeId);
  url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    return NextResponse.json({ results: [] }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
