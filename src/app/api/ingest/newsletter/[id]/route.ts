import { NextRequest, NextResponse } from "next/server";
import { updateNewsletterArticle } from "@/lib/db";

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
  const { title, source, link, category, description } = body;

  if (link) {
    try {
      const url = new URL(link);
      if (url.pathname === "/" || url.pathname === "") {
        return NextResponse.json(
          { error: `link must be a full article URL, not a root domain: ${link}` },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: `Invalid URL in link: ${link}` }, { status: 400 });
    }
  }

  const updated = await updateNewsletterArticle(id, { title, source, link, category, description });
  if (!updated) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
