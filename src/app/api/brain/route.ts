import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchBrainFiles, fetchBrainFileContent } from "@/lib/github";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("admin_token")?.value;
  const body = await req.json().catch(() => ({}));
  let authed = cookieToken === process.env.TASKS_PASSWORD;

  if (!authed) {
    authed = body.password === process.env.TASKS_PASSWORD;
  }

  if (!authed) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  if (body.action === "content" && body.path) {
    const content = await fetchBrainFileContent(body.path);
    if (!content) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json({ content });
  }

  const files = await fetchBrainFiles();
  return NextResponse.json({ files });
}
