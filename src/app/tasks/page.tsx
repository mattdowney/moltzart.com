"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  Clock,
  Archive,
  Loader,
  Ban,
  CheckCircle2,
  Circle,
  CircleDot,
  RefreshCw,
  Lock,
  Repeat,
} from "lucide-react";
import { AuthShell } from "@/components/admin/auth-shell";
import { CollapsiblePanel } from "@/components/admin/collapsible-panel";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  text: string;
  status: "done" | "partial" | "open";
  detail?: string;
}

interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

interface RecurringTask {
  task: string;
  schedule: string;
  method: string;
}

interface ParsedTasks {
  sections: Section[];
  recurring: RecurringTask[];
}

const sectionConfig: Record<
  string,
  { icon: typeof AlertTriangle; color: string; badge: string }
> = {
  urgent: {
    icon: AlertTriangle,
    color: "text-red-400",
    badge: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  active: {
    icon: Loader,
    color: "text-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  blocked: {
    icon: Ban,
    color: "text-orange-400",
    badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  },
  scheduled: {
    icon: Clock,
    color: "text-blue-400",
    badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  },
  backlog: {
    icon: Archive,
    color: "text-zinc-400",
    badge: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
};

function StatusIcon({ status }: { status: Task["status"] }) {
  switch (status) {
    case "done":
      return <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-1" />;
    case "partial":
      return <CircleDot size={14} className="text-amber-400 shrink-0 mt-1" />;
    case "open":
      return <Circle size={14} className="text-zinc-500 shrink-0 mt-1" />;
  }
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <StatusIcon status={task.status} />
      <div className="min-w-0">
        <span
          className={`type-body-sm ${
            task.status === "done"
              ? "text-zinc-500 line-through"
              : "text-zinc-200"
          }`}
        >
          {task.text}
        </span>
        {task.detail && (
          <p className="type-body-sm text-zinc-500 mt-1">{task.detail}</p>
        )}
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: Section }) {
  const config = sectionConfig[section.id] || sectionConfig.backlog;
  const Icon = config.icon;
  const hasTasks = section.tasks.length > 0;

  return (
    <CollapsiblePanel
      icon={Icon}
      iconClassName={config.color}
      title={section.title}
      defaultCollapsed={section.id === "completed"}
      meta={
        <Badge variant="status" shape="pill" className={config.badge}>
          {section.tasks.length}
        </Badge>
      }
      bodyClassName="px-4 pb-3"
      emptyState={<p className="type-body-sm text-zinc-600 pt-3 italic">Nothing here</p>}
    >
      {hasTasks ? (
        <div className="pt-2">
          {section.tasks.map((task, i) => (
            <TaskItem key={i} task={task} />
          ))}
        </div>
      ) : null}
    </CollapsiblePanel>
  );
}

function RecurringStrip({ tasks }: { tasks: RecurringTask[] }) {
  if (tasks.length === 0) return null;

  return (
    <CollapsiblePanel
      icon={Repeat}
      title="Recurring"
      defaultCollapsed
      meta={<span className="type-body-sm text-zinc-600">{tasks.length}</span>}
      bodyClassName="px-4 pb-3"
    >
      <div className="pt-2 space-y-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 type-body-sm">
            <span className="text-zinc-300 flex-1">{t.task}</span>
            <span className="text-zinc-500">{t.schedule}</span>
            <span className="text-zinc-600">{t.method}</span>
          </div>
        ))}
      </div>
    </CollapsiblePanel>
  );
}

function TasksHeader({
  lastUpdated,
  loading,
  onRefresh,
}: {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <PageHeader title="Tasks">
      {lastUpdated && (
        <span className="type-body-sm text-zinc-500">
          Updated{" "}
          {lastUpdated.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRefresh} disabled={loading}>
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      </Button>
    </PageHeader>
  );
}

function TasksPasswordGate({
  password,
  loading,
  error,
  onSubmit,
  onPasswordChange,
}: {
  password: string;
  loading: boolean;
  error: string;
  onSubmit: (event: React.FormEvent) => void;
  onPasswordChange: (value: string) => void;
}) {
  return (
    <AuthShell
      icon={Lock}
      title="Tasks"
      subtitle="Internal task feed. Enter the shared password to load the current queue."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        {error && <p className="type-body-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "View Tasks"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function Tasks() {
  const [password, setPassword] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("tasks_pw") || "";
  });
  const [data, setData] = useState<ParsedTasks | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTasks = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.status === 401) {
        setError("Wrong password");
        setAuthed(false);
        sessionStorage.removeItem("tasks_pw");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load tasks");
        setLoading(false);
        return;
      }
      const parsed = await res.json();
      setData(parsed);
      setAuthed(true);
      setLastUpdated(new Date());
      sessionStorage.setItem("tasks_pw", pw);
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) fetchTasks(password.trim());
  };

  if (!authed) {
    return (
      <TasksPasswordGate
        password={password}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onPasswordChange={setPassword}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-8">
      <div className="max-w-[1080px] mx-auto space-y-6">
        <TasksHeader
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={() => fetchTasks(password)}
        />

        {data && (
          <div className="space-y-3">
            {data.sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
            <RecurringStrip tasks={data.recurring} />
          </div>
        )}
      </div>
    </div>
  );
}
