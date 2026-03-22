import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin-auth";
import { fetchTasksDb } from "@/lib/db";

export async function POST() {
  const authed = await getAdminAuth();

  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await fetchTasksDb();
  return NextResponse.json(data);
}
