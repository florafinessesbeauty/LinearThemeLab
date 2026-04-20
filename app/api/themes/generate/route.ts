import { NextResponse } from "next/server";
import {
  ThemeGenerateRequestSchema,
  ThemeGenerateResponseSchema
} from "@linearthemelab/shared";

export async function POST(req: Request) {
  const json = await req.json();

  // Validate request using shared schema
  const parsed = ThemeGenerateRequestSchema.parse(json);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/themes/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Generate failed" }, { status: res.status });
  }

  const data = await res.json();

  // Validate backend response
  const validated = ThemeGenerateResponseSchema.parse(data);

  return NextResponse.json(validated);
}
