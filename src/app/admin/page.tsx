import Link from "next/link";
import {
  CheckSquare,
  FileText,
  ArrowRight,
  Circle,
  CheckCircle2,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { fetchTasks, fetchResearchList } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [tasksData, researchDocs] = await Promise.all([
    fetchTasks(),
    fetchResearchList(),
  ]);

  const taskSummary = {
    urgent: 0,
    active: 0,
    blocked: 0,
    completed: 0,
  };
  for (const section of tasksData.sections) {
    const openCount = section.tasks.filter((t) => t.status !== "done").length;
    const doneCount = section.tasks.filter((t) => t.status === "done").length;
    if (section.id === "urgent") taskSummary.urgent = openCount;
    if (section.id === "active") taskSummary.active = openCount;
    if (section.id === "blocked") taskSummary.blocked = section.tasks.length;
    taskSummary.completed += doneCount;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of tasks and research
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Tasks card */}
        <Link
          href="/admin/tasks"
          className="border rounded-lg p-5 hover:bg-accent/50 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-muted-foreground" />
              <h2 className="font-medium">Tasks</h2>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </div>
          <div className="space-y-2">
            {taskSummary.urgent > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-red-400 font-medium">
                  {taskSummary.urgent} urgent
                </span>
              </div>
            )}
            {taskSummary.active > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Loader size={14} className="text-amber-400" />
                <span>{taskSummary.active} active</span>
              </div>
            )}
            {taskSummary.blocked > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Circle size={14} className="text-orange-400" />
                <span>{taskSummary.blocked} blocked</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 size={14} />
              <span>{taskSummary.completed} completed</span>
            </div>
          </div>
        </Link>

        {/* Research card */}
        <Link
          href="/admin/research"
          className="border rounded-lg p-5 hover:bg-accent/50 transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-muted-foreground" />
              <h2 className="font-medium">Research</h2>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground mb-2">
              {researchDocs.length} documents
            </p>
            {researchDocs.slice(0, 5).map((doc) => (
              <p key={doc.slug} className="text-sm truncate">
                {doc.title}
              </p>
            ))}
            {researchDocs.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{researchDocs.length - 5} more
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
