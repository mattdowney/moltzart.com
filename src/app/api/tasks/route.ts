import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.TASKS_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const res = await fetch(
    "https://api.github.com/repos/moltzart/openclaw-home/contents/TODO.md",
    {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.raw+json",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 502 }
    );
  }

  const markdown = await res.text();
  return NextResponse.json({ markdown });
}
