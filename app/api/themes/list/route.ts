import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base = process.env.SERVER_URL;
    if (!base) return NextResponse.json([]);
    const res = await fetch(base + "/themes/list");
    if (!res.ok) return NextResponse.json([], { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([]);
  }
}
