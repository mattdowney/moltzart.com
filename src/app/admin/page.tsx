import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Newspaper, Radar, Workflow } from "lucide-react";
import {
  fetchTasksDb,
  fetchNewsletterArticlesDb,
} from "@/lib/db";
import { normalizeTaskStatusInput } from "@/lib/task-workflow";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { StatusDot } from "@/components/admin/status-dot";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { SummaryCard } from "@/components/admin/summary-card";
import { ContextRail } from "@/components/admin/context-rail";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/admin/empty-state";
import { getCronCalendarData } from "@/lib/openclaw-crons";
import { estimateHighFrequencyIntervalMinutes, getTodayHealthStatus, isCronScheduledOnDate } from "@/lib/cron-health";
import { formatShortDate } from "@/lib/date-format";

export const dynamic = "force-dynamic";

type ActionRow = {
  id: string;
  title: string;
  reason: "waiting" | "ready";
  href: string;
};

const REASON_META: Record<ActionRow["reason"], { label: string; dot: "urgent" | "active" | "blocked" | "complete"; pulse: boolean }> = {
  waiting: { label: "waiting", dot: "blocked", pulse: true },
  ready: { label: "ready", dot: "active", pulse: false },
};

const ACTION_CAP = 8;
const reasonOrder: Record<ActionRow["reason"], number> = { waiting: 0, ready: 1 };

export default async function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);

  const [tasks, newsletterArticles, cronData] = await Promise.all([
    fetchTasksDb(),
    fetchNewsletterArticlesDb(),
    getCronCalendarData(today, today),
  ]);

  // --- Action queue ---
  const actions: ActionRow[] = [];

  for (const t of tasks) {
    const status = normalizeTaskStatusInput(t.status);
    if (status === "done") continue;

    if (t.blocked_by) {
      actions.push({ id: t.id, title: t.title, reason: "waiting", href: "/admin/tasks" });
    } else if (status === "todo") {
      actions.push({ id: t.id, title: t.title, reason: "ready", href: "/admin/tasks" });
    }
  }

  actions.sort((a, b) => reasonOrder[a.reason] - reasonOrder[b.reason]);

  // --- Health signals ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => normalizeTaskStatusInput(t.status) === "done").length;
  const blockedCount = tasks.filter((t) => t.blocked_by && normalizeTaskStatusInput(t.status) !== "done").length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const enabledJobs = cronData.crons.filter((j) => j.enabled);
  const dueTodayJobs = enabledJobs.filter((job) => {
    if (estimateHighFrequencyIntervalMinutes(job.schedule_expr)) return true;
    return isCronScheduledOnDate(job.schedule_expr, today);
  });
  const healthyTodayJobs = dueTodayJobs.filter((job) => {
    const status = getTodayHealthStatus(job, cronData.jobRuns, today);
    return status === "success" || status === "running";
  });
  const unknownTodayJobs = dueTodayJobs.filter((job) => getTodayHealthStatus(job, cronData.jobRuns, today) === "unknown");

  // --- Recent activity ---
  const latestDigestDate = newsletterArticles.length > 0 ? newsletterArticles[0].digest_date.slice(0, 10) : null;
  const latestDigestCount = latestDigestDate
    ? newsletterArticles.filter((a) => a.digest_date.slice(0, 10) === latestDigestDate).length
    : 0;

  const displayedActions = actions.slice(0, ACTION_CAP);
  const hasMore = actions.length > ACTION_CAP;
  const waitingActions = actions.filter((item) => item.reason === "waiting");
  const readyActions = actions.filter((item) => item.reason === "ready");

  const summaryCards = [
    {
      href: "/admin/calendar",
      icon: Workflow,
      title: "System Health",
      description: cronData.meta.telemetryState === "none"
        ? "Schedule is synced, but OpenClaw has not pushed run telemetry yet."
        : `${healthyTodayJobs.length} of ${dueTodayJobs.length} jobs due today are green.`,
      meta: <SummaryMeta value={cronData.meta.telemetryState === "none" ? "Telemetry offline" : unknownTodayJobs.length > 0 ? `${unknownTodayJobs.length} unknown` : healthyTodayJobs.length === dueTodayJobs.length ? "On schedule" : "Needs review"} tone={cronData.meta.telemetryState === "none" ? "neutral" : healthyTodayJobs.length === dueTodayJobs.length && unknownTodayJobs.length === 0 ? "complete" : "active"} />,
    },
    {
      href: "/admin/newsletter",
      icon: Newspaper,
      title: "New Intake",
      description: latestDigestDate
        ? `${latestDigestCount} newsletter picks landed on ${formatShortDate(latestDigestDate)}.`
        : "No newsletter intake has landed yet today.",
      meta: <SummaryMeta value={latestDigestCount > 0 ? `${latestDigestCount} new` : "Quiet"} tone={latestDigestCount > 0 ? "complete" : "neutral"} />,
    },
  ] as const;

  const railSections = [
    {
      id: "health",
      title: "Health",
      content: (
        <>
          <RailMetric
            href="/admin/calendar"
            label="Agents"
            value={cronData.meta.telemetryState === "none" ? "Telemetry not synced yet" : `${healthyTodayJobs.length}/${dueTodayJobs.length} due today are green`}
            tone={cronData.meta.telemetryState === "none" ? "neutral" : healthyTodayJobs.length === dueTodayJobs.length && unknownTodayJobs.length === 0 ? "complete" : "active"}
          />
          <RailMetric
            href="/admin/tasks"
            label="Waiting"
            value={blockedCount === 0 ? "No waiting tasks" : `${blockedCount} tasks waiting on another step`}
            tone={blockedCount === 0 ? "complete" : "blocked"}
          />
          <RailMetric
            href="/admin/tasks"
            label="Completion"
            value={`${completedTasks}/${totalTasks} tasks closed`}
            tone={completionPct >= 80 ? "complete" : "neutral"}
          />
        </>
      ),
    },
    {
      id: "intake",
      title: "Intake",
      content: latestDigestDate ? (
        <Link
          href="/admin/newsletter"
          className={cn(
            adminSurfaceVariants({ variant: "embedded" }),
            "group block px-3 py-3 transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/50"
          )}
        >
          <div className="flex items-start gap-3">
            <Newspaper size={14} className="mt-1 shrink-0 text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="type-body-sm font-medium text-zinc-200">Latest newsletter batch</p>
              <p className="mt-1 type-body-sm text-zinc-500">
                {latestDigestCount} picks landed on {latestDigestDate}.
              </p>
            </div>
            <ArrowUpRight size={10} className="mt-1 shrink-0 text-zinc-600 transition-colors group-hover:text-teal-400" />
          </div>
        </Link>
      ) : (
        <p className="type-body-sm text-zinc-500">No fresh newsletter intake yet.</p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Dashboard" />

      <div className="grid gap-3 lg:grid-cols-2">
        {summaryCards.map((card) => (
          <Link key={card.title} href={card.href} className="block transition-transform duration-150 hover:-translate-y-0.5">
            <SummaryCard {...card} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <Panel className="flex flex-col overflow-hidden">
          <PanelHeader
            icon={Radar}
            title="Action Queue"
            description="Work grouped by the order it deserves attention."
            count={actions.length}
            countLabel={actions.length === 1 ? "item" : "items"}
            action={{ label: "Open tasks", href: "/admin/tasks" }}
          />

          {displayedActions.length > 0 ? (
            <div className="divide-y divide-zinc-800/30">
              <ActionSection label="Waiting" items={displayedActions.filter((item) => item.reason === "waiting")} />
              <ActionSection label="Ready Next" items={displayedActions.filter((item) => item.reason === "ready")} />
              {hasMore && (
                <div className="px-4 py-3">
                  <Link
                    href="/admin/tasks"
                    className="inline-flex items-center gap-1 type-body-sm text-zinc-500 transition-colors hover:text-teal-400"
                  >
                    View the full queue <ArrowUpRight size={10} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="Queue is clear"
              description="No waiting or ready-next tasks are asking for attention right now."
              className="px-4 py-8"
              align="start"
            />
          )}
        </Panel>

        <ContextRail sections={railSections} />
      </div>
    </div>
  );
}

function ActionSection({
  label,
  items,
}: {
  label: string;
  items: ActionRow[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-zinc-500">{label}</p>
        <span className="type-body-sm text-zinc-600">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const meta = REASON_META[item.reason];
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                adminSurfaceVariants({ variant: "embedded" }),
                "flex items-center gap-3 px-3 py-2 transition-colors hover:border-zinc-700/50 hover:bg-zinc-900/50"
              )}
            >
              <StatusDot variant={meta.dot} pulse={meta.pulse} />
              <span className="min-w-0 flex-1 truncate type-body-sm text-zinc-200">{item.title}</span>
              <Badge variant="outline" className="shrink-0 border-zinc-700/50 bg-zinc-800/20 text-zinc-500 type-badge">
                {meta.label}
              </Badge>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function RailMetric({
  href,
  label,
  value,
  tone,
}: {
  href: string;
  label: string;
  value: string;
  tone: "urgent" | "active" | "blocked" | "complete" | "neutral";
}) {
  return (
    <Link href={href} className="block rounded-lg px-1 py-1 transition-colors hover:text-teal-400">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <StatusDot variant={tone} pulse={tone === "blocked"} />
          <p className="type-body-sm font-medium text-zinc-200">{label}</p>
        </div>
        <p className="type-body-sm text-zinc-500">{value}</p>
      </div>
    </Link>
  );
}

function SummaryMeta({
  value,
  tone,
}: {
  value: string;
  tone: "urgent" | "active" | "complete" | "neutral";
}) {
  return (
    <div className="inline-flex items-center gap-2 type-body-sm text-zinc-500">
      <StatusDot variant={tone} />
      <span>{value}</span>
    </div>
  );
}
