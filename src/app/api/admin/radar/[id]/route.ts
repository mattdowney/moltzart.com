import { NextRequest, NextResponse } from "next/server";
import { deleteRadarItem } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteRadarItem(id);
  return NextResponse.json({ ok: true });
}
