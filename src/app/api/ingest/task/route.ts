import { NextRequest, NextResponse } from "next/server";
import { insertTask } from "@/lib/db";

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
  const { title, detail, priority, effort, due_date, blocked_by, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Missing required field: title" }, { status: 400 });
  }

  const id = await insertTask(title, { detail, priority, effort, due_date, blocked_by, status });
  return NextResponse.json({ ok: true, id });
}
