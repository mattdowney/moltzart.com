import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { password } = await req.json();
  const { slug } = await params;

  if (password !== process.env.TASKS_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch(
    `https://api.github.com/repos/moltzart/openclaw-home/contents/research/${encodeURIComponent(slug)}.md`,
    {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.raw+json",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const content = await res.text();

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");

  return NextResponse.json({ title, content });
}
