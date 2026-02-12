"use client";

import type { NewsletterDigest } from "@/lib/github";
import { ExternalLink, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Week {
  id: string;
  label: string;
  digests: NewsletterDigest[];
}

function getWeekMonday(dateStr: string): Date {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function formatWeekLabel(monday: Date): string {
  return `Week of ${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function groupByWeek(digests: NewsletterDigest[]): Week[] {
  const weekMap = new Map<string, { monday: Date; digests: NewsletterDigest[] }>();

  for (const digest of digests) {
    const monday = getWeekMonday(digest.date);
    const key = monday.toISOString().split("T")[0];
    if (!weekMap.has(key)) {
      weekMap.set(key, { monday, digests: [] });
    }
    weekMap.get(key)!.digests.push(digest);
  }

  return Array.from(weekMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, { monday, digests }]) => ({
      id: key,
      label: formatWeekLabel(monday),
      digests: digests.sort((a, b) => b.date.localeCompare(a.date)),
    }));
}

export function NewsletterView({ digests }: { digests: NewsletterDigest[] }) {
  const weeks = groupByWeek(digests);

  if (weeks.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight mb-6">Newsletter</h1>
        <p className="text-sm text-zinc-500">No digests found yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6">Newsletter</h1>
      <Tabs defaultValue={weeks[0].id}>
        <TabsList className="mb-6">
          {weeks.map((week) => (
            <TabsTrigger key={week.id} value={week.id}>
              {week.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {weeks.map((week) => (
          <TabsContent key={week.id} value={week.id}>
            <div className="space-y-6">
              {week.digests.map((digest) => (
                <div key={digest.date}>
                  <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 px-1">
                    {digest.label}
                  </h2>
                  <div className="space-y-4">
                    {digest.sections.map((section) => (
                      <div key={section.source}>
                        <h3 className="text-sm font-medium text-zinc-400 mb-2 px-1">
                          {section.source}
                        </h3>
                        <div className="space-y-1.5">
                          {section.articles.map((article, idx) => {
                            const isHigh = article.relevance.includes("HIGH");
                            return (
                              <a
                                key={idx}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 px-4 py-3 border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors group"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    {isHigh && (
                                      <Star size={12} className="text-amber-500 shrink-0 fill-amber-500" />
                                    )}
                                    <span className="text-sm text-zinc-200 font-medium">
                                      {article.summary}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-zinc-600">{article.topic}</span>
                                    <span className="text-xs text-zinc-700">·</span>
                                    <span className={`text-xs ${isHigh ? "text-amber-600" : "text-zinc-600"}`}>
                                      {article.relevance.replace(/⭐\s*/g, "")}
                                    </span>
                                  </div>
                                </div>
                                <ExternalLink
                                  size={14}
                                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 mt-1"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
