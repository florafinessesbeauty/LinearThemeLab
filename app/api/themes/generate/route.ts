import { NextResponse } from "next/server";
import {
  ThemeGenerateRequestSchema,
  ThemeGenerateResponseSchema,
} from "@linearthemelab/shared";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = ThemeGenerateRequestSchema.parse(json);

  const res = await fetch(
    `${process.env.INTERNAL_API_BASE_URL}/api/themes/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Generate failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  const validated = ThemeGenerateResponseSchema.parse(data);

  return NextResponse.json(validated);
}
