"use client";

import { useState } from "react";
import type { DraftDay, DbXDraft } from "@/lib/db";
import { ExternalLink, PenLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectionPanel } from "@/components/admin/collection-panel";
import { EmptyState } from "@/components/admin/empty-state";

const STATUS_STYLES: Record<string, string> = {
  queued: "text-amber-400",
  posted: "text-teal-400",
  draft: "text-zinc-500",
  rejected: "text-red-400/70",
};

export function DraftsView({ days: initialDays }: { days: DraftDay[] }) {
  const [days, setDays] = useState(initialDays);
  const [openDates, setOpenDates] = useState<Set<string>>(
    () => new Set(initialDays.length > 0 ? [initialDays[0].date] : [])
  );

  if (days.length === 0) {
    return <EmptyState icon={PenLine} message="No drafts this week." />;
  }

  function toggleDay(date: string) {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  async function deleteDraft(dayDate: string, draftId: string) {
    setDays((prev) =>
      prev
        .map((d) =>
          d.date === dayDate
            ? { ...d, drafts: d.drafts.filter((dr) => dr.id !== draftId) }
            : d
        )
        .filter((d) => d.drafts.length > 0)
    );
    await fetch(`/api/admin/draft/${draftId}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isOpen = openDates.has(day.date);
        return (
          <CollapsibleDayPanel
            key={day.date}
            icon={PenLine}
            title={day.label}
            countLabel={`${day.drafts.length} drafts`}
            isOpen={isOpen}
            onToggle={() => toggleDay(day.date)}
          >
            {day.drafts.map((draft) => (
              <DraftRow
                key={draft.id}
                draft={draft}
                onDelete={() => deleteDraft(day.date, draft.id)}
              />
            ))}
          </CollapsibleDayPanel>
        );
      })}
    </div>
  );
}

function CollapsibleDayPanel({
  icon,
  title,
  countLabel,
  isOpen,
  onToggle,
  children,
}: {
  icon: typeof PenLine;
  title: string;
  countLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <CollectionPanel
      icon={icon}
      iconClassName="text-teal-400"
      title={title}
      description="A bounded batch of drafts from one day in the selected week."
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

function DraftRow({ draft, onDelete }: { draft: DbXDraft; onDelete: () => void }) {
  const statusClass = STATUS_STYLES[draft.status] ?? "text-zinc-500";

  return (
    <div className="px-4 py-4 hover:bg-zinc-800/40 transition-colors group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={statusClass}>
              {draft.status}
            </Badge>
            {draft.source_batch && (
              <span className="type-body-sm text-zinc-600">{draft.source_batch}</span>
            )}
            {draft.tweet_url && (
              <a
                href={draft.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 type-body-sm text-teal-400 hover:text-teal-400 transition-colors"
              >
                <ExternalLink size={10} />
                <span>view on X</span>
              </a>
            )}
          </div>
          <p className="type-body-sm text-zinc-200 whitespace-pre-wrap">
            {draft.text}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onDelete}
          className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 shrink-0 mt-1"
          title="Delete draft"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
