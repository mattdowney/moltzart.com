import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.TASKS_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/repos/moltzart/openclaw-home/contents/research",
    {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch research list" }, { status: 502 });
  }

  const files = await res.json();
  const docs = files
    .filter((f: { name: string }) => f.name.endsWith(".md"))
    .map((f: { name: string }) => ({
      slug: f.name.replace(/\.md$/, ""),
      title: f.name
        .replace(/\.md$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    }));

  return NextResponse.json({ docs });
}
