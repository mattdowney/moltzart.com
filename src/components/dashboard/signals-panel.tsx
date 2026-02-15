import { EmptyState } from "@/components/admin/empty-state";
import { MessageSquare, Lightbulb } from "lucide-react";
import type { DbContentFeedback, DbNewsletterAngle } from "@/lib/db";

interface SignalsPanelProps {
  feedback: DbContentFeedback[];
  angles: DbNewsletterAngle[];
}

function signalColor(signal: string) {
  const lower = signal.toLowerCase();
  if (lower === "positive" || lower === "engage" || lower === "resonance") return "bg-emerald-400";
  if (lower === "negative" || lower === "avoid" || lower === "drop") return "bg-red-400";
  return "bg-zinc-400";
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const docDate = new Date(d.toLocaleString("en-US", { timeZone: "America/New_York" }));
  today.setHours(0, 0, 0, 0);
  docDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - docDate.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SignalsPanel({ feedback, angles }: SignalsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Content Feedback */}
      <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/30">
          <MessageSquare size={14} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-200">Content Feedback</span>
          {feedback.length > 0 && (
            <span className="text-xs font-mono text-zinc-600">{feedback.length}</span>
          )}
        </div>
        {feedback.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-6">
            <EmptyState icon={MessageSquare} message="No feedback yet" />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/20">
            {feedback.slice(0, 6).map((f) => (
              <div key={f.id} className="px-4 py-2.5 flex items-start gap-2.5">
                <span className={`mt-1.5 size-2 rounded-full shrink-0 ${signalColor(f.signal)}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-200 truncate">{f.topic}</span>
                    {f.source && (
                      <span className="text-[10px] text-zinc-600 shrink-0">{f.source}</span>
                    )}
                  </div>
                  {f.reason && (
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{f.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strategic Angles */}
      <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/30">
          <Lightbulb size={14} className="text-zinc-500" />
          <span className="text-sm font-medium text-zinc-200">Strategic Angles</span>
          {angles.length > 0 && (
            <span className="text-xs font-mono text-zinc-600">{angles.length}</span>
          )}
        </div>
        {angles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-6">
            <EmptyState icon={Lightbulb} message="No angles yet" />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/20">
            {angles.slice(0, 6).map((a) => (
              <div key={a.id} className="px-4 py-2.5">
                <p className="text-sm text-zinc-200 line-clamp-2">{a.angle}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
                  <span>{formatRelativeDate(a.date)}</span>
                  {a.supporting_items && a.supporting_items.length > 0 && (
                    <span className="font-mono">{a.supporting_items.length} items</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
