"use client";

import { useState } from "react";
import {
  Check,
  X,
  MessageSquare,
  Repeat2,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Draft, DraftDay, DraftStatus } from "@/lib/github";

function StatusBadge({ status }: { status: DraftStatus }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400">
          <Clock size={10} />
          Pending
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">
          <CheckCircle2 size={10} />
          Approved
        </span>
      );
    case "posted":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400">
          <Send size={10} />
          Posted
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">
          <XCircle size={10} />
          Rejected
        </span>
      );
  }
}

function TypeIcon({ type }: { type: "original" | "reply" }) {
  if (type === "reply") return <Repeat2 size={14} className="text-zinc-500" />;
  return <MessageSquare size={14} className="text-zinc-500" />;
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
  return (
    <div className="border border-zinc-800/50 rounded-lg bg-zinc-900/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon type={draft.type} />
          <span className="text-xs text-zinc-400">
            {draft.type === "reply" ? (
              <>
                Reply to{" "}
                <a
                  href={`https://x.com/${draft.replyTo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:underline"
                >
                  @{draft.replyTo}
                </a>
                {draft.replyContext && (
                  <span className="text-zinc-600"> ({draft.replyContext})</span>
                )}
              </>
            ) : (
              "Original post"
            )}
          </span>
        </div>
        <StatusBadge status={draft.status} />
      </div>

      <blockquote className="text-sm text-zinc-200 leading-relaxed border-l-2 border-zinc-700 pl-3">
        {draft.content}
      </blockquote>

      <div className="flex items-center justify-between text-xs text-zinc-600">
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

      {draft.feedback && (
        <p className="text-xs text-zinc-500 italic">{draft.feedback}</p>
      )}

      {draft.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onAction(draft.id, "approve")}
            disabled={acting === draft.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors disabled:opacity-50"
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => onAction(draft.id, "reject")}
            disabled={acting === draft.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors disabled:opacity-50"
          >
            <X size={12} />
            Reject
          </button>
        </div>
      )}
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
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    // Auto-collapse days with no pending drafts
    const set = new Set<string>();
    for (const day of initialDays) {
      if (!day.drafts.some((d) => d.status === "pending")) {
        set.add(day.date);
      }
    }
    return set;
  });

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const handleAction = async (draftId: string, action: "approve" | "reject") => {
    setActing(draftId);
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, action }),
      });
      if (res.ok) {
        // Update local state
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
    <div className="space-y-6">
      {days.map((day) => {
        const isCollapsed = collapsed.has(day.date);
        const pendingCount = day.drafts.filter((d) => d.status === "pending").length;

        return (
          <div key={day.date}>
            <button
              onClick={() => toggleCollapse(day.date)}
              className="flex items-center gap-2 w-full text-left mb-2 px-1 group"
            >
              {isCollapsed ? (
                <ChevronRight size={14} className="text-zinc-600" />
              ) : (
                <ChevronDown size={14} className="text-zinc-600" />
              )}
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {day.label}
              </h2>
              <span className="text-xs text-zinc-600">
                {day.drafts.length} draft{day.drafts.length !== 1 ? "s" : ""}
              </span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400">
                  {pendingCount} pending
                </span>
              )}
            </button>
            {!isCollapsed && (
              <div className="space-y-3">
                {day.drafts.map((draft) => (
                  <DraftCard
                    key={draft.id}
                    draft={draft}
                    onAction={handleAction}
                    acting={acting}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
