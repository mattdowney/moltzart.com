import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchTasksDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  // Accept auth from either cookie or body password
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("admin_token")?.value;

  let authed = cookieToken === process.env.TASKS_PASSWORD;

  if (!authed) {
    try {
      const { password } = await req.json();
      authed = password === process.env.TASKS_PASSWORD;
    } catch {}
  }

  if (!authed) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const data = await fetchTasksDb();
  return NextResponse.json(data);
}
