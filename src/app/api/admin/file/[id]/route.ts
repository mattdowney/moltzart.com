import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { deleteFile } from "@/lib/db";
import { getAdminAuth } from "@/lib/admin-auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAdminAuth();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteFile(id);

  if (!result) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Delete from Vercel Blob storage too
  try {
    await del(result.blob_url);
  } catch {
    // Blob may already be deleted; continue
  }

  return NextResponse.json({ ok: true });
}
