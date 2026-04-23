import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base = process.env.SERVER_URL;
    if (!base) {
      console.error("SERVER_URL is not defined");
      return NextResponse.json([]);
    }

    const res = await fetch(base + "/themes/list");

    if (!res.ok) {
      console.error("Failed to fetch theme list:", res.status);
      return NextResponse.json([], { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Unexpected error in /api/themes/list:", error);
    return NextResponse.json([], { status: 500 });
  }
}
