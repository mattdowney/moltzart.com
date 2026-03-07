"use client";

import { useState } from "react";
import type { NewsletterDigest } from "@/lib/db";
import { ExternalLink, Newspaper, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionPanel } from "@/components/admin/collection-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { PillarTag } from "@/components/admin/tag-badge";

export function NewsletterView({ digests: initialDigests }: { digests: NewsletterDigest[] }) {
  const [digests, setDigests] = useState(initialDigests);
  const [openDates, setOpenDates] = useState<Set<string>>(
    () => new Set(initialDigests.length > 0 ? [initialDigests[0].date] : [])
  );

  if (digests.length === 0) {
    return <EmptyState icon={Newspaper} message="No picks yet." />;
  }

  function toggleDay(date: string) {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  async function deleteArticle(digestDate: string, articleId: string) {
    setDigests((prev) =>
      prev
        .map((d) =>
          d.date === digestDate
            ? { ...d, articles: d.articles.filter((a) => a.id !== articleId), articleCount: d.articles.length - 1 }
            : d
        )
        .filter((d) => d.articles.length > 0)
    );
    await fetch(`/api/admin/newsletter/${articleId}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-3">
      {digests.map((digest) => {
        const isOpen = openDates.has(digest.date);
        return (
          <CollapsibleDigestPanel
            key={digest.date}
            title={digest.label}
            countLabel={`${digest.articles.length} articles`}
            isOpen={isOpen}
            onToggle={() => toggleDay(digest.date)}
          >
            {digest.articles.map((article) => (
              <NewsletterRow
                key={article.id}
                digestDate={digest.date}
                article={article}
                onDelete={deleteArticle}
              />
            ))}
          </CollapsibleDigestPanel>
        );
      })}
    </div>
  );
}

function CollapsibleDigestPanel({
  title,
  countLabel,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  countLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <CollectionPanel
      icon={Newspaper}
      iconClassName="text-teal-400"
      title={title}
      description="A bounded review set for one day in the selected week."
      open={isOpen}
      onOpenChange={onToggle}
      meta={<span className="type-body-sm text-zinc-500">{countLabel}</span>}
      bodyClassName="divide-y divide-zinc-800/30"
      className="overflow-hidden"
    >
      {isOpen ? children : null}
    </CollectionPanel>
  );
}

function NewsletterRow({
  digestDate,
  article,
  onDelete,
}: {
  digestDate: string;
  article: NewsletterDigest["articles"][number];
  onDelete: (digestDate: string, articleId: string) => Promise<void>;
}) {
  const Wrapper = article.link ? "a" : "div";
  const linkProps = article.link
    ? { href: article.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div className="flex items-start gap-2 px-4 py-3 hover:bg-zinc-800/40 transition-colors group">
      <Wrapper {...linkProps} className="flex-1 min-w-0">
        <div className="mb-1">
          {article.category && <PillarTag pillar={article.category} />}
          <p className="type-body-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate mt-1">
            {article.title}
          </p>
        </div>
        <p className="type-body-sm text-zinc-500 line-clamp-2">
          {article.description}
        </p>
      </Wrapper>
      <div className="flex items-center gap-1 shrink-0 mt-1">
        {article.link && (
          <ExternalLink size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.preventDefault();
            void onDelete(digestDate, article.id);
          }}
          className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100"
          title="Delete article"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
