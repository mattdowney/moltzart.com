import { NextRequest, NextResponse } from "next/server";
import { insertResearchDoc } from "@/lib/db";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

export async function POST(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, title, content, status, tags, research_request_id } = body;

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "Missing required fields: slug, title, content" }, { status: 400 });
  }

  const id = await insertResearchDoc(slug, title, content, { status, tags, research_request_id });
  return NextResponse.json({ ok: true, id });
}
