import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, path, contents } = body;

  if (!themeId || !path) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/save`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId, path, contents }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Save failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
