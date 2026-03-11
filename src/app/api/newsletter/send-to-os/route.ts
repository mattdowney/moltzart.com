import { NextRequest, NextResponse } from "next/server";
import { markArticleSentToOs } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { id, url, title, source, weekMonday } = await req.json();
  if (!url || !weekMonday) {
    return NextResponse.json({ error: "url and weekMonday required" }, { status: 400 });
  }

  const osBase = process.env.OS_BASE_URL;
  const osKey = process.env.OS_BULK_IMPORT_KEY;
  if (!osBase || !osKey) {
    return NextResponse.json({ error: "OS integration not configured" }, { status: 500 });
  }

  const res = await fetch(`${osBase}/api/newsletter/links/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, title, source, weekMonday, apiKey: osKey }),
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: "OS import failed", detail: body }, { status: res.status });
  }

  if (id) {
    await markArticleSentToOs(id);
  }

  const data = await res.json();
  return NextResponse.json(data);
}
