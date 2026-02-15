import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  FileText,
} from "lucide-react";
import { fetchTasks, fetchDrafts, fetchResearchList } from "@/lib/github";
import {
  fetchRadarDatesDb,
  fetchRadarItemsByDate,
  fetchRecentFeedback,
  fetchRecentAngles,
  fetchOpenResearchRequests,
} from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/admin/status-dot";
import { EmptyState } from "@/components/admin/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { RadarHighlights } from "@/components/dashboard/radar-highlights";

export const dynamic = "force-dynamic";

type ActionItem = {
  type: "urgent" | "pending-draft" | "research-request";
  label: string;
  source: string;
  sourceHref: string;
  dotVariant: "urgent" | "active" | "complete";
};

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.round(wordCount / 200));
  return `${mins} min`;
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr);
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

export default async function AdminDashboard() {
  const [tasksData, draftsData, radarDates, feedback, angles, researchRequests, researchDocs] =
    await Promise.all([
      fetchTasks(),
      fetchDrafts(),
      fetchRadarDatesDb(),
      fetchRecentFeedback(),
      fetchRecentAngles(),
      fetchOpenResearchRequests(),
      fetchResearchList(),
    ]);

  // Sequential: fetch latest radar day
  const latestDate = radarDates[0] || null;
  const latestRadar = latestDate
    ? { items: await fetchRadarItemsByDate(latestDate) }
    : null;

  // Task stats
  const taskStats = { urgent: 0, active: 0, blocked: 0, completed: 0, total: 0 };
  for (const section of tasksData.sections) {
    const open = section.tasks.filter((t) => t.status !== "done").length;
    const done = section.tasks.filter((t) => t.status === "done").length;
    if (section.id === "urgent") taskStats.urgent = open;
    if (section.id === "active") taskStats.active = open;
    if (section.id === "blocked") taskStats.blocked = section.tasks.length;
    taskStats.completed += done;
    taskStats.total += section.tasks.length;
  }

  // Draft stats
  const allDrafts = draftsData.days.flatMap((d) => d.drafts);
  const draftStats = {
    pending: allDrafts.filter((d) => d.status === "pending").length,
    approved: allDrafts.filter((d) => d.status === "approved").length,
    posted: allDrafts.filter((d) => d.status === "posted").length,
  };

  // Action queue
  const actions: ActionItem[] = [];

  const urgentTasks = tasksData.sections
    .find((s) => s.id === "urgent")
    ?.tasks.filter((t) => t.status !== "done") || [];
  for (const task of urgentTasks) {
    actions.push({
      type: "urgent",
      label: task.text,
      source: "Tasks",
      sourceHref: "/admin/tasks",
      dotVariant: "urgent",
    });
  }

  const pendingDrafts = allDrafts.filter((d) => d.status === "pending");
  for (const draft of pendingDrafts) {
    actions.push({
      type: "pending-draft",
      label: draft.content.slice(0, 120) + (draft.content.length > 120 ? "..." : ""),
      source: "Content Ideas",
      sourceHref: "/admin/drafts",
      dotVariant: "active",
    });
  }

  for (const req of researchRequests) {
    actions.push({
      type: "research-request",
      label: req.title,
      source: "Research Request",
      sourceHref: "/admin/research",
      dotVariant: "active",
    });
  }

  const taskProgress = taskStats.total > 0
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0;

  const radarItemCount = latestRadar?.items.length || 0;
  const recentResearch = researchDocs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Row 1: Metrics strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Urgent"
          value={taskStats.urgent}
          subtitle={`${taskStats.active} active · ${taskStats.blocked} blocked`}
          href="/admin/tasks"
        >
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400/60 rounded-full"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-1 font-mono">
            {taskStats.completed}/{taskStats.total} done
          </p>
        </StatCard>

        <StatCard
          title="Radar"
          value={radarItemCount}
          subtitle={latestDate ? `Scanned ${latestDate}` : "No scans yet"}
          href="/admin/radar"
        >
        </StatCard>

        <StatCard
          title="Content Ideas"
          value={draftStats.pending}
          subtitle={`${draftStats.approved} approved · ${draftStats.posted} posted`}
          href="/admin/drafts"
        />

        <StatCard
          title="Research"
          value={researchDocs.length}
          subtitle={researchRequests.length > 0 ? `${researchRequests.length} open request${researchRequests.length !== 1 ? "s" : ""}` : "No open requests"}
          href="/admin/research"
        />
      </div>

      {/* Row 2: Action Queue (full width, only if items exist) */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Needs attention
          </h2>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 divide-y divide-zinc-800/30">
            {actions.map((item, i) => (
              <Link
                key={i}
                href={item.sourceHref}
                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/40 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <StatusDot variant={item.dotVariant} pulse={item.type === "urgent"} />
                <span className="text-sm text-zinc-200 flex-1 min-w-0 truncate">
                  {item.label}
                </span>
                <Badge
                  variant="outline"
                  className="border-zinc-700/50 text-zinc-500 bg-zinc-800/20 text-[10px] shrink-0"
                >
                  {item.source}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {actions.length === 0 && (
        <EmptyState icon={CircleCheck} message="All clear — nothing needs attention" />
      )}

      {/* Row 3: Radar + Signals (2-column on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Radar — takes 3/5 */}
        <div className="lg:col-span-3">
          <RadarHighlights
            date={latestDate || "—"}
            items={latestRadar?.items || []}
          />
        </div>

        {/* Signals sidebar — takes 2/5 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content Feedback */}
          <SignalsFeedbackCard feedback={feedback} />
          {/* Strategic Angles */}
          <SignalsAnglesCard angles={angles} />
        </div>
      </div>

      {/* Row 4: Recent Research (condensed) */}
      {recentResearch.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Recent Research
            </h2>
            <Link
              href="/admin/research"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {recentResearch.map((doc) => (
              <Link
                key={doc.slug}
                href={`/admin/research/${doc.slug}`}
                className="flex items-start gap-3 px-4 py-3 border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors group"
              >
                <FileText size={14} className="text-zinc-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-zinc-200 line-clamp-1">{doc.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {doc.wordCount && (
                      <span className="text-[10px] font-mono text-zinc-600">
                        {readTime(doc.wordCount)}
                      </span>
                    )}
                    {doc.createdAt && (
                      <span className="text-[10px] text-zinc-600">
                        {formatRelativeDate(doc.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight
                  size={12}
                  className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-1"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline sub-components for the signals sidebar (keep in same file — they're layout-specific)

function SignalsFeedbackCard({ feedback }: { feedback: Awaited<ReturnType<typeof fetchRecentFeedback>> }) {
  const signalColor = (signal: string) => {
    const lower = signal.toLowerCase();
    if (lower === "positive" || lower === "engage" || lower === "resonance") return "bg-emerald-400";
    if (lower === "negative" || lower === "avoid" || lower === "drop") return "bg-red-400";
    return "bg-zinc-400";
  };

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/30">
        <span className="size-2 rounded-full bg-zinc-500" />
        <span className="text-xs font-medium text-zinc-300">Content Feedback</span>
        {feedback.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-600">{feedback.length}</span>
        )}
      </div>
      {feedback.length === 0 ? (
        <p className="px-4 py-6 text-xs text-zinc-600 text-center">No feedback yet</p>
      ) : (
        <div className="divide-y divide-zinc-800/20">
          {feedback.slice(0, 5).map((f) => (
            <div key={f.id} className="px-4 py-2 flex items-start gap-2">
              <span className={`mt-1.5 size-1.5 rounded-full shrink-0 ${signalColor(f.signal)}`} />
              <div className="min-w-0 flex-1">
                <span className="text-xs text-zinc-300 line-clamp-1">{f.topic}</span>
                {f.reason && (
                  <p className="text-[10px] text-zinc-600 line-clamp-1">{f.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignalsAnglesCard({ angles }: { angles: Awaited<ReturnType<typeof fetchRecentAngles>> }) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/30">
        <span className="size-2 rounded-full bg-amber-400/60" />
        <span className="text-xs font-medium text-zinc-300">Strategic Angles</span>
        {angles.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-600">{angles.length}</span>
        )}
      </div>
      {angles.length === 0 ? (
        <p className="px-4 py-6 text-xs text-zinc-600 text-center">No angles yet</p>
      ) : (
        <div className="divide-y divide-zinc-800/20">
          {angles.slice(0, 5).map((a) => (
            <div key={a.id} className="px-4 py-2">
              <p className="text-xs text-zinc-300 line-clamp-2">{a.angle}</p>
              {a.supporting_items && a.supporting_items.length > 0 && (
                <span className="text-[10px] font-mono text-zinc-600">
                  {a.supporting_items.length} supporting items
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
