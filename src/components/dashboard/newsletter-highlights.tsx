import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { Panel } from "@/components/admin/panel";
import type { NewsletterArticle } from "@/lib/db";

const sourceColors: Record<string, string> = {
  "The Verge": "bg-violet-500/20 text-violet-400",
  "TechCrunch": "bg-emerald-500/20 text-emerald-400",
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

interface NewsletterHighlightsProps {
  articles: NewsletterArticle[];
  date: string | null;
}

export function NewsletterHighlights({ articles, date }: NewsletterHighlightsProps) {
  return (
    <Panel className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30">
        <div className="flex items-center gap-2">
          <Newspaper size={14} className="text-teal-500" />
          <span className="text-sm font-medium text-zinc-200">Newsletter Picks</span>
          {date && <span className="text-xs text-zinc-600 font-mono">{date}</span>}
        </div>
        <Link
          href="/admin/newsletter"
          className="text-xs text-zinc-500 hover:text-teal-400 transition-colors flex items-center gap-1"
        >
          View all <ArrowUpRight size={10} />
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <EmptyState icon={Newspaper} message="No picks yet." />
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/20">
          {articles.map((article) => {
            const Wrapper = article.link ? "a" : "div";
            const linkProps = article.link
              ? { href: article.link, target: "_blank" as const, rel: "noopener noreferrer" }
              : {};
            return (
              <div key={article.id} className="px-4 py-2.5 hover:bg-zinc-800/40 transition-colors">
                <Wrapper {...linkProps} className="block">
                  {article.source && <SourceBadge source={article.source} />}
                  <p className="text-sm text-zinc-200 truncate mt-0.5">{article.title}</p>
                  {article.description && (
                    <p className="text-xs text-zinc-500 truncate">{article.description}</p>
                  )}
                </Wrapper>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
