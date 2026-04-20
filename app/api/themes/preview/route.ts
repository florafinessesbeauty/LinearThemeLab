import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const res = await fetch(process.env.SERVER_URL + `/themes/preview?id=${id}`);
  const html = await res.text();

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
