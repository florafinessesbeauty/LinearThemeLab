import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, path, versionId } = body;

  if (!themeId || !path || !versionId) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/versions/restore`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId, path, versionId }),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Restore failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
