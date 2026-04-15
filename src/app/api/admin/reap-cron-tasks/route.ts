import { NextRequest, NextResponse } from "next/server";
import { deleteTasksBySource } from "@/lib/db";

function checkCronAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deleteTasksBySource("cron");
  console.log(`[reap-cron-tasks] deleted ${deleted} row(s)`);
  return NextResponse.json({ ok: true, deleted });
}
