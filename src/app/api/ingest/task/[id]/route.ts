import { NextRequest, NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/db";
import { normalizeTaskStatusInput } from "@/lib/task-workflow";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, detail, effort, due_date, blocked_by, board_order, assigned_to, working } = body;
  const normalizedStatus = status === undefined ? undefined : normalizeTaskStatusInput(status);
  const normalizedBoardOrder = board_order === undefined ? undefined : Number(board_order);

  const updated = await updateTask(id, {
    status: normalizedStatus,
    detail,
    effort,
    due_date,
    blocked_by,
    board_order: Number.isFinite(normalizedBoardOrder) ? normalizedBoardOrder : undefined,
    assigned_to,
    working: working === undefined ? undefined : Boolean(working),
  });
  if (!updated) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteTask(id);
  if (!removed) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
