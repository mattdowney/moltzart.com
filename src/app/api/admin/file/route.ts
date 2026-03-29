import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { insertFile } from "@/lib/db";
import { getAdminAuth } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authed = await getAdminAuth();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
  });

  const dbFile = await insertFile({
    filename: file.name,
    blob_url: blob.url,
    size: file.size,
    content_type: file.type || undefined,
    uploader: "admin",
  });

  return NextResponse.json({ ok: true, file: dbFile });
}
