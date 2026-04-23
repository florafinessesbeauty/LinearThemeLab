import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/ai/code-suggest`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream AI service error" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
