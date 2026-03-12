import { NextRequest, NextResponse } from "next/server";
import { insertNewsletterArticles } from "@/lib/db";

function checkIngestAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.INGEST_API_KEY;
}

/** Strip tracking/referral params from URLs so the same article with different UTM tags deduplicates. */
function normalizeLink(link: string): string {
  try {
    const url = new URL(link);
    const stripParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "ref", "source", "s", "ss", "mc_cid", "mc_eid",
    ];
    for (const p of stripParams) {
      url.searchParams.delete(p);
    }
    // Remove empty search string
    const clean = url.searchParams.toString();
    return url.origin + url.pathname + (clean ? `?${clean}` : "") + url.hash;
  } catch {
    return link;
  }
}

export async function POST(req: NextRequest) {
  if (!checkIngestAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { digest_date, articles } = body;

  if (!digest_date || !Array.isArray(articles) || articles.length === 0) {
    return NextResponse.json({ error: "Missing required fields: digest_date, articles (non-empty array)" }, { status: 400 });
  }

  for (const a of articles) {
    if (!a.title) {
      return NextResponse.json({ error: "Each article requires a title" }, { status: 400 });
    }
    if (a.link) {
      try {
        const url = new URL(a.link);
        if (url.pathname === "/" || url.pathname === "") {
          return NextResponse.json(
            { error: `link must be a full article URL, not a root domain: ${a.link}` },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json({ error: `Invalid URL in link: ${a.link}` }, { status: 400 });
      }
      // Normalize the link before it hits the DB
      a.link = normalizeLink(a.link);
    }
  }

  const { ids, skipped } = await insertNewsletterArticles(digest_date, articles);
  return NextResponse.json({ ok: true, ids, ...(skipped.length > 0 ? { skipped } : {}) });
}
