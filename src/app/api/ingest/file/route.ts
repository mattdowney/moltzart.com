import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { insertFile, fetchFilesDb } from "@/lib/db";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await fetchFilesDb();
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploader = (formData.get("uploader") as string) || "api";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "private",
    });

    const dbFile = await insertFile({
      filename: file.name,
      blob_url: blob.url,
      size: file.size,
      content_type: file.type || undefined,
      uploader,
    });

    return NextResponse.json({
      ok: true,
      file: dbFile,
      blob_url: blob.url,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("File upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
