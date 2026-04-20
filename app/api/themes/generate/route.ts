import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { niche, goal } = await req.json();

  // Call backend Express API
  await fetch(process.env.SERVER_URL + "/themes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ niche, goal }),
  });

  return NextResponse.json({ status: "ok" });
}
