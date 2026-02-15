"use client";

import type { NewsletterDigest } from "@/lib/db";
import { ExternalLink, Newspaper } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";

const sourceColors: Record<string, string> = {
  "The Verge": "bg-purple-500/20 text-purple-400",
  "Hacker News": "bg-orange-500/20 text-orange-400",
  "TechCrunch": "bg-green-500/20 text-green-400",
  "Ars Technica": "bg-blue-500/20 text-blue-400",
  "Wired": "bg-red-500/20 text-red-400",
  "MIT Technology Review": "bg-cyan-500/20 text-cyan-400",
  "Bloomberg": "bg-violet-500/20 text-violet-400",
  "Reuters": "bg-sky-500/20 text-sky-400",
  "NYT": "bg-zinc-400/20 text-zinc-300",
  "Platformer": "bg-pink-500/20 text-pink-400",
  "Stratechery": "bg-amber-500/20 text-amber-400",
};

function SourceBadge({ source }: { source: string }) {
  const colors = sourceColors[source] || "bg-zinc-700/30 text-zinc-400";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${colors}`}>
      {source}
    </span>
  );
}

export function NewsletterView({ digests }: { digests: NewsletterDigest[] }) {
  // Sort all digests chronologically (newest first) — already sorted from fetch
  const totalArticles = digests.reduce((sum, d) => sum + d.articles.length, 0);

  if (digests.length === 0) {
    return (
      <div>
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex flex-col">
          <div className="flex items-center px-4 py-3 border-b border-zinc-800/30">
            <div className="flex items-center gap-2">
              <Newspaper size={14} className="text-teal-500" />
              <span className="text-sm font-medium text-zinc-200">Newsletter</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center py-8">
            <EmptyState icon={Newspaper} message="No picks yet." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {digests.map((digest) => (
        <div key={digest.date} className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30">
            <div className="flex items-center gap-2">
              <Newspaper size={14} className="text-teal-500" />
              <span className="text-sm font-medium text-zinc-200">{digest.label}</span>
              <span className="text-xs text-zinc-600 font-mono">{digest.articles.length} articles</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-800/20">
            {digest.articles.map((article, idx) => (
              <a
                key={idx}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SourceBadge source={article.source} />
                      <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
                        {article.title}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-1"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
