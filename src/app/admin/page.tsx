import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  PenLine,
  FileText,
  ArrowUpRight,
  Circle,
  Repeat,
} from "lucide-react";
import { fetchTasks, fetchDrafts, fetchResearchList } from "@/lib/github";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tasksData, draftsData, researchDocs] = await Promise.all([
    fetchTasks(),
    fetchDrafts(),
    fetchResearchList(),
  ]);

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
    rejected: allDrafts.filter((d) => d.status === "rejected").length,
  };

  // Urgent tasks list
  const urgentTasks = tasksData.sections
    .find((s) => s.id === "urgent")
    ?.tasks.filter((t) => t.status !== "done") || [];

  // Pending drafts
  const pendingDrafts = allDrafts.filter((d) => d.status === "pending");

  // Approved but not yet posted
  const approvedDrafts = allDrafts.filter((d) => d.status === "approved");

  // Recent research
  const recentResearch = researchDocs.slice(0, 3);

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>

      {/* Status row */}
      <div className="grid grid-cols-4 gap-4">
        <Link href="/admin/tasks" className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 hover:bg-zinc-900/60 transition-colors">
          <p className="text-2xl font-semibold text-zinc-100">{taskStats.urgent}</p>
          <p className="text-xs text-zinc-500 mt-1">Urgent tasks</p>
        </Link>
        <Link href="/admin/drafts" className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 hover:bg-zinc-900/60 transition-colors">
          <p className="text-2xl font-semibold text-zinc-100">{draftStats.pending}</p>
          <p className="text-xs text-zinc-500 mt-1">Drafts to review</p>
        </Link>
        <Link href="/admin/drafts" className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 hover:bg-zinc-900/60 transition-colors">
          <p className="text-2xl font-semibold text-zinc-100">{draftStats.approved}</p>
          <p className="text-xs text-zinc-500 mt-1">Ready to post</p>
        </Link>
        <Link href="/admin/research" className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 hover:bg-zinc-900/60 transition-colors">
          <p className="text-2xl font-semibold text-zinc-100">{researchDocs.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Research docs</p>
        </Link>
      </div>

      {/* Attention needed */}
      {(urgentTasks.length > 0 || pendingDrafts.length > 0 || approvedDrafts.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Needs attention</h2>

          {urgentTasks.length > 0 && (
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-sm font-medium text-zinc-200">Urgent tasks</span>
                </div>
                <Link href="/admin/tasks" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                  View all <ArrowUpRight size={10} />
                </Link>
              </div>
              <div className="space-y-2">
                {urgentTasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Circle size={12} className="text-zinc-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-300">{task.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingDrafts.length > 0 && (
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenLine size={14} className="text-amber-400" />
                  <span className="text-sm font-medium text-zinc-200">Drafts awaiting review</span>
                </div>
                <Link href="/admin/drafts" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                  Review <ArrowUpRight size={10} />
                </Link>
              </div>
              <div className="space-y-2">
                {pendingDrafts.map((draft) => (
                  <div key={draft.id} className="flex items-start gap-2">
                    <Clock size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-300 line-clamp-1">{draft.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approvedDrafts.length > 0 && (
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="text-sm font-medium text-zinc-200">Approved — ready to post</span>
                </div>
                <Link href="/admin/drafts" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                  View <ArrowUpRight size={10} />
                </Link>
              </div>
              <div className="space-y-2">
                {approvedDrafts.map((draft) => (
                  <div key={draft.id} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-green-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-300 line-clamp-1">{draft.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity overview */}
      <div className="grid grid-cols-2 gap-4">
        {/* X Activity */}
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-200">X / @moltzart</span>
            <Link href="/admin/drafts" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              Drafts <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-semibold text-zinc-200">{draftStats.posted}</p>
              <p className="text-xs text-zinc-500">Posted</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{draftStats.approved}</p>
              <p className="text-xs text-zinc-500">Approved</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{draftStats.pending}</p>
              <p className="text-xs text-zinc-500">Pending</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{draftStats.rejected}</p>
              <p className="text-xs text-zinc-500">Rejected</p>
            </div>
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-200">Tasks</span>
            <Link href="/admin/tasks" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              All tasks <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-semibold text-zinc-200">{taskStats.urgent}</p>
              <p className="text-xs text-zinc-500">Urgent</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{taskStats.active}</p>
              <p className="text-xs text-zinc-500">Active</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{taskStats.blocked}</p>
              <p className="text-xs text-zinc-500">Blocked</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-200">{taskStats.completed}</p>
              <p className="text-xs text-zinc-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Research docs */}
      {recentResearch.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent research</h2>
            <Link href="/admin/research" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              All docs <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentResearch.map((doc) => (
              <Link
                key={doc.slug}
                href={`/admin/research/${doc.slug}`}
                className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-zinc-500" />
                  <span className="text-sm text-zinc-300">{doc.title}</span>
                </div>
                <ArrowUpRight size={12} className="text-zinc-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recurring */}
      {tasksData.recurring.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recurring automations</h2>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-zinc-800/50">
                  <th className="text-left font-medium px-4 py-2.5">Task Name</th>
                  <th className="text-left font-medium px-4 py-2.5">Runs</th>
                  <th className="text-left font-medium px-4 py-2.5">Execution</th>
                </tr>
              </thead>
              <tbody>
                {tasksData.recurring.map((t, i) => (
                  <tr key={i} className="border-b border-zinc-800/30 last:border-0">
                    <td className="text-left text-sm text-zinc-300 px-4 py-2.5">{t.task}</td>
                    <td className="text-left text-sm text-zinc-500 px-4 py-2.5 whitespace-nowrap">{t.schedule}</td>
                    <td className="text-left text-sm text-zinc-600 px-4 py-2.5">{t.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
