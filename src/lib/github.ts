const GH_TOKEN = () => process.env.GITHUB_TOKEN!;
const REPO = "moltzart/openclaw-home";

async function ghFetch(path: string, accept = "application/vnd.github.v3+json") {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${GH_TOKEN()}`,
      Accept: accept,
    },
    next: { revalidate: 0 },
  });
}

export interface ResearchDoc {
  slug: string;
  title: string;
  sha: string;
  createdAt: string | null;
}

export async function fetchResearchList(): Promise<ResearchDoc[]> {
  const res = await ghFetch(`/repos/${REPO}/contents/research`);
  if (!res.ok) return [];

  const files = await res.json();
  const mdFiles = files.filter((f: { name: string }) => f.name.endsWith(".md"));

  const docs = await Promise.all(
    mdFiles.map(async (f: { name: string; sha: string }) => {
      const slug = f.name.replace(/\.md$/, "");
      const title = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      let createdAt: string | null = null;
      try {
        const commitsRes = await ghFetch(
          `/repos/${REPO}/commits?path=research/${encodeURIComponent(f.name)}&per_page=1`
        );
        if (commitsRes.ok) {
          const linkHeader = commitsRes.headers.get("link");
          const commits = await commitsRes.json();

          if (linkHeader && linkHeader.includes('rel="last"')) {
            const lastMatch = linkHeader.match(/<([^>]+)>;\s*rel="last"/);
            if (lastMatch) {
              const lastRes = await fetch(lastMatch[1], {
                headers: {
                  Authorization: `Bearer ${GH_TOKEN()}`,
                  Accept: "application/vnd.github.v3+json",
                },
              });
              if (lastRes.ok) {
                const lastCommits = await lastRes.json();
                const oldest = lastCommits[lastCommits.length - 1];
                createdAt = oldest?.commit?.author?.date || null;
              }
            }
          } else if (commits.length > 0) {
            createdAt = commits[commits.length - 1]?.commit?.author?.date || null;
          }
        }
      } catch {}

      return { slug, title, sha: f.sha, createdAt };
    })
  );

  docs.sort((a, b) => {
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return docs;
}

export interface ResearchDocDetail {
  title: string;
  content: string;
  sha: string;
}

export async function fetchResearchDoc(slug: string): Promise<ResearchDocDetail | null> {
  const res = await ghFetch(
    `/repos/${REPO}/contents/research/${encodeURIComponent(slug)}.md`
  );
  if (!res.ok) return null;

  const fileData = await res.json();
  const content = Buffer.from(fileData.content, "base64").toString("utf-8");
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");

  return { title, content, sha: fileData.sha };
}

export async function deleteResearchDoc(slug: string): Promise<boolean> {
  const fileRes = await ghFetch(
    `/repos/${REPO}/contents/research/${encodeURIComponent(slug)}.md`
  );
  if (!fileRes.ok) return false;
  const fileData = await fileRes.json();

  const deleteRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/research/${encodeURIComponent(slug)}.md`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${GH_TOKEN()}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete research: ${slug}`,
        sha: fileData.sha,
      }),
    }
  );

  return deleteRes.ok;
}

// --- Tasks ---

interface Task {
  text: string;
  status: "done" | "partial" | "open";
  detail?: string;
}

interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

interface RecurringTask {
  task: string;
  schedule: string;
  method: string;
}

export interface ParsedTasks {
  sections: Section[];
  recurring: RecurringTask[];
}

function parseTaskText(raw: string): { text: string; detail?: string } {
  const dashSplit = raw.split(/\s[—–]\s/);
  const text = dashSplit[0].replace(/\*\*/g, "").trim();
  const detail = dashSplit.length > 1 ? dashSplit.slice(1).join(" — ").trim() : undefined;
  return { text, detail };
}

function parseTodoMd(md: string): ParsedTasks {
  const sections: Section[] = [];
  const recurring: RecurringTask[] = [];

  const sectionMap: Record<string, string> = {
    URGENT: "urgent",
    SCHEDULED: "scheduled",
    BACKLOG: "backlog",
    ACTIVE: "active",
    BLOCKED: "blocked",
    COMPLETED: "completed",
  };

  const lines = md.split("\n");
  let currentSection: Section | null = null;
  let inRecurring = false;

  for (const line of lines) {
    const sectionMatch = line.match(/^## .+?(URGENT|SCHEDULED|BACKLOG|ACTIVE|BLOCKED|COMPLETED)/);
    if (sectionMatch) {
      inRecurring = false;
      const key = sectionMatch[1];
      const id = sectionMap[key] || key.toLowerCase();
      let title = key.charAt(0) + key.slice(1).toLowerCase();
      const subtitleMatch = line.match(/\(([^)]+)\)/);
      if (subtitleMatch) title += ` · ${subtitleMatch[1]}`;

      currentSection = { id, title, tasks: [] };
      sections.push(currentSection);
      continue;
    }

    if (line.match(/RECURRING/i)) {
      inRecurring = true;
      currentSection = null;
      continue;
    }

    if (inRecurring) {
      if (line.startsWith("|") && !line.includes("---") && !line.includes("Task")) {
        const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 3) {
          recurring.push({ task: cols[0], schedule: cols[1], method: cols[2] });
        }
      }
      continue;
    }

    if (currentSection && line.match(/^\s*-\s*\[/)) {
      const doneMatch = line.match(/^\s*-\s*\[x\]\s*(.*)/i);
      const partialMatch = line.match(/^\s*-\s*\[~\]\s*(.*)/);
      const openMatch = line.match(/^\s*-\s*\[ \]\s*(.*)/);

      if (doneMatch) {
        const { text, detail } = parseTaskText(doneMatch[1]);
        currentSection.tasks.push({ text, status: "done", detail });
      } else if (partialMatch) {
        const { text, detail } = parseTaskText(partialMatch[1]);
        currentSection.tasks.push({ text, status: "partial", detail });
      } else if (openMatch) {
        const { text, detail } = parseTaskText(openMatch[1]);
        currentSection.tasks.push({ text, status: "open", detail });
      }
    }
  }

  return {
    sections: sections.filter((s) => s.tasks.length > 0 || s.id === "urgent"),
    recurring,
  };
}

export async function fetchTasks(): Promise<ParsedTasks> {
  const res = await ghFetch(
    `/repos/${REPO}/contents/TODO.md`,
    "application/vnd.github.raw+json"
  );
  if (!res.ok) return { sections: [], recurring: [] };

  const markdown = await res.text();
  return parseTodoMd(markdown);
}
