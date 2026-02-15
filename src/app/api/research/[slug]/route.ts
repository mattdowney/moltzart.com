import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchResearchDocBySlug, deleteResearchDocBySlug } from "@/lib/db";

async function checkAuth(req: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("admin_token")?.value;
  if (cookieToken === process.env.TASKS_PASSWORD) return true;

  try {
    const { password } = await req.json();
    return password === process.env.TASKS_PASSWORD;
  } catch {
    return false;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const { slug } = await params;
  const doc = await fetchResearchDocBySlug(slug);
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const { slug } = await params;
  const ok = await deleteResearchDocBySlug(slug);

  if (!ok) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
