"use client";

import { AdminShell, useAdminAuth } from "@/components/admin-shell";
import { useState, useEffect } from "react";
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

interface TaskSummary {
  urgent: number;
  active: number;
  blocked: number;
  open: number;
  completed: number;
}

interface DocSummary {
  count: number;
  docs: { slug: string; title: string }[];
}

function DashboardContent() {
  const { password } = useAdminAuth();
  const [tasks, setTasks] = useState<TaskSummary | null>(null);
  const [research, setResearch] = useState<DocSummary | null>(null);

  useEffect(() => {
    if (!password) return;

    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((data) => {
        const summary: TaskSummary = {
          urgent: 0,
          active: 0,
          blocked: 0,
          open: 0,
          completed: 0,
        };
        for (const section of data.sections || []) {
          const openCount = section.tasks.filter(
            (t: { status: string }) => t.status === "open"
          ).length;
          const doneCount = section.tasks.filter(
            (t: { status: string }) => t.status === "done"
          ).length;
          if (section.id === "urgent") summary.urgent = openCount;
          if (section.id === "active")
            summary.active = section.tasks.filter(
              (t: { status: string }) => t.status !== "done"
            ).length;
          if (section.id === "blocked") summary.blocked = section.tasks.length;
          summary.open += openCount;
          summary.completed += doneCount;
        }
        setTasks(summary);
      })
      .catch(() => {});

    fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResearch({ count: data.docs.length, docs: data.docs.slice(0, 5) });
      })
      .catch(() => {});
  }, [password]);

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
          {tasks ? (
            <div className="space-y-2">
              {tasks.urgent > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-red-400 font-medium">
                    {tasks.urgent} urgent
                  </span>
                </div>
              )}
              {tasks.active > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Loader size={14} className="text-amber-400" />
                  <span>{tasks.active} active</span>
                </div>
              )}
              {tasks.blocked > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Circle size={14} className="text-orange-400" />
                  <span>{tasks.blocked} blocked</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 size={14} />
                <span>{tasks.completed} completed today</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
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
          {research ? (
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground mb-2">
                {research.count} documents
              </p>
              {research.docs.map((doc) => (
                <p key={doc.slug} className="text-sm truncate">
                  {doc.title}
                </p>
              ))}
              {research.count > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{research.count - 5} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <DashboardContent />
    </AdminShell>
  );
}
