import { NextRequest, NextResponse } from "next/server";
import { fetchCronJobs } from "@/lib/db";
import { ingestCronSnapshot } from "@/lib/openclaw-crons";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await fetchCronJobs();
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { jobs, runs, sync } = body;

  if ((!Array.isArray(jobs) || jobs.length === 0) && (!Array.isArray(runs) || runs.length === 0)) {
    return NextResponse.json({ error: "Missing required field: jobs or runs (array)" }, { status: 400 });
  }

  const { upsertedJobs, upsertedRuns } = await ingestCronSnapshot({ jobs, runs, sync: sync === true });
  return NextResponse.json({ ok: true, upsertedJobs, upsertedRuns });
}
