import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId } = body;

  if (!themeId) {
    return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/export`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Export failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
