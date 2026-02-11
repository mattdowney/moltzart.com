"use client";

import { useState } from "react";
import type { Draft, DraftStatus } from "@/lib/github";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function statusBadge(status: DraftStatus) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
          Approved
        </Badge>
      );
    case "posted":
      return (
        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
          Posted
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="border-zinc-600/30 text-zinc-500 bg-zinc-800/30">
          Rejected
        </Badge>
      );
  }
}

function DraftCard({
  draft,
  onAction,
  acting,
}: {
  draft: Draft;
  onAction: (id: string, action: "approve" | "reject") => void;
  acting: string | null;
}) {
  const isPending = draft.status === "pending";

  return (
    <div className={`rounded-lg border p-5 space-y-4 ${
      isPending
        ? "border-zinc-700 bg-zinc-900/60"
        : "border-zinc-800/50 bg-zinc-900/30"
    }`}>
      {/* Header: type + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {draft.type === "reply" && draft.replyTo ? (
            <>
              <span>Reply to</span>
              <a
                href={`https://x.com/${draft.replyTo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:underline font-medium"
              >
                @{draft.replyTo}
              </a>
              {draft.replyContext && (
                <span className="text-zinc-600">&mdash; {draft.replyContext}</span>
              )}
            </>
          ) : (
            <span className="font-medium text-zinc-400">Original post</span>
          )}
        </div>
        {statusBadge(draft.status)}
      </div>

      {/* Draft content — the main event */}
      <p className="text-[15px] leading-relaxed text-zinc-100">
        {draft.content}
      </p>

      {/* Footer: char count, links, feedback */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span>{draft.content.length} chars</span>
          {draft.tweetId && (
            <a
              href={`https://x.com/moltzart/status/${draft.tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 underline"
            >
              View on X
            </a>
          )}
        </div>

        {/* Actions for pending drafts */}
        {isPending && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAction(draft.id, "approve")}
              disabled={acting === draft.id}
              className="bg-green-600 text-white hover:bg-green-500"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(draft.id, "reject")}
              disabled={acting === draft.id}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
            >
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Feedback if rejected */}
      {draft.feedback && (
        <p className="text-xs text-zinc-600 italic border-t border-zinc-800/50 pt-3">
          {draft.feedback}
        </p>
      )}
    </div>
  );
}

export function DayDraftsView({ drafts: initialDrafts }: { drafts: Draft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [acting, setActing] = useState<string | null>(null);

  // Show pending first, then approved, posted, rejected
  const sorted = [...drafts].sort((a, b) => {
    const order: Record<DraftStatus, number> = {
      pending: 0,
      approved: 1,
      posted: 2,
      rejected: 3,
    };
    return order[a.status] - order[b.status];
  });

  const handleAction = async (draftId: string, action: "approve" | "reject") => {
    setActing(draftId);
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, action }),
      });
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === draftId
              ? { ...d, status: (action === "approve" ? "approved" : "rejected") as DraftStatus }
              : d
          )
        );
      }
    } catch (e) {
      console.error("Draft action failed:", e);
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-4">
      {sorted.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          onAction={handleAction}
          acting={acting}
        />
      ))}
    </div>
  );
}
