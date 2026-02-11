"use client";

import { useState } from "react";
import type { Draft, DraftDay, DraftStatus } from "@/lib/github";

function DraftCard({
  draft,
  onAction,
  acting,
}: {
  draft: Draft;
  onAction: (id: string, action: "approve" | "reject") => void;
  acting: string | null;
}) {
  return (
    <div className="border border-zinc-800 rounded-lg bg-zinc-900/50 p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {draft.type === "reply" && draft.replyTo && (
            <p className="text-xs text-zinc-500 mb-2">
              Reply to{" "}
              <a
                href={`https://x.com/${draft.replyTo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:underline"
              >
                @{draft.replyTo}
              </a>
              {draft.replyContext && (
                <span className="text-zinc-600"> &mdash; {draft.replyContext}</span>
              )}
            </p>
          )}
          <p className="text-[15px] text-zinc-100 leading-relaxed whitespace-pre-wrap">
            {draft.content}
          </p>
          <p className="text-xs text-zinc-600 mt-2">{draft.content.length} chars</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onAction(draft.id, "approve")}
            disabled={acting === draft.id}
            className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => onAction(draft.id, "reject")}
            disabled={acting === draft.id}
            className="px-4 py-2 rounded-md text-sm font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function PastDraft({ draft }: { draft: Draft }) {
  const statusColor = {
    posted: "text-blue-400",
    approved: "text-green-400",
    rejected: "text-zinc-600",
    pending: "text-amber-400",
  }[draft.status];

  const statusLabel = {
    posted: "Posted",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
  }[draft.status];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800/50 last:border-0">
      <span className={`text-xs font-medium shrink-0 w-16 ${statusColor}`}>
        {statusLabel}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-400 line-clamp-2">{draft.content}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-600">
          <span>{draft.date}</span>
          {draft.type === "reply" && draft.replyTo && (
            <span>Reply to @{draft.replyTo}</span>
          )}
          {draft.tweetId && (
            <a
              href={`https://x.com/moltzart/status/${draft.tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 underline"
            >
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function DraftsView({
  days: initialDays,
  sha: initialSha,
}: {
  days: DraftDay[];
  sha: string;
}) {
  const [days, setDays] = useState(initialDays);
  const [acting, setActing] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  const allDrafts = days.flatMap((d) => d.drafts);
  const pending = allDrafts.filter((d) => d.status === "pending");
  const past = allDrafts.filter((d) => d.status !== "pending");

  const handleAction = async (draftId: string, action: "approve" | "reject") => {
    setActing(draftId);
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, action }),
      });
      if (res.ok) {
        setDays((prev) =>
          prev.map((day) => ({
            ...day,
            drafts: day.drafts.map((d) =>
              d.id === draftId
                ? { ...d, status: (action === "approve" ? "approved" : "rejected") as DraftStatus }
                : d
            ),
          }))
        );
      }
    } catch (e) {
      console.error("Draft action failed:", e);
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-8">
      {pending.length === 0 ? (
        <p className="text-sm text-zinc-500 py-8 text-center">
          No drafts awaiting review.
        </p>
      ) : (
        <div className="space-y-4">
          {pending.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onAction={handleAction}
              acting={acting}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {showPast ? "Hide" : "Show"} past drafts ({past.length})
          </button>
          {showPast && (
            <div className="mt-3">
              {past.map((draft) => (
                <PastDraft key={draft.id} draft={draft} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
