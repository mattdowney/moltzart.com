import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin-auth";
import { getCronCalendarData } from "@/lib/openclaw-crons";

export async function GET(req: NextRequest) {
  const auth = await getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl;
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end params" }, { status: 400 });
  }

  return NextResponse.json(await getCronCalendarData(start, end));
}
