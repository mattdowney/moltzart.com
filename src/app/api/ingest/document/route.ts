import { NextRequest, NextResponse } from "next/server";
import { insertDocument, fetchDocumentsDb } from "@/lib/db";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const category = req.nextUrl.searchParams.get("category") || undefined;
  const documents = await fetchDocumentsDb(category);
  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, category, agent } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing required fields: title and content" },
      { status: 400 }
    );
  }

  const id = await insertDocument({ title, content, category, agent });
  return NextResponse.json({ ok: true, id });
}
