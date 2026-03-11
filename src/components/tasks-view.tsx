"use client";

import { useMemo, useState } from "react";
import type { DbTask } from "@/lib/db";
import {
  Calendar,
  CircleAlert,
  FolderOpen,
  RefreshCw,
  GripVertical,
  CheckCircle2,
  PlayCircle,
  ListTodo,
} from "lucide-react";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { Panel } from "@/components/admin/panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TASK_BOARD_STATUSES,
  TASK_STATUS_LABELS,
  type TaskStatus,
  normalizeTaskStatusInput,
} from "@/lib/task-workflow";
import { EmptyState } from "@/components/admin/empty-state";
import { cn } from "@/lib/utils";
import { formatShortDate, formatShortDateTime } from "@/lib/date-format";
import { getAgentMeta } from "@/lib/agents";

function isTaskLate(task: DbTask): boolean {
  if (!task.due_date || task.status === "done") return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.due_date < today;
}

type TaskColumns = Record<TaskStatus, DbTask[]>;
type DragOverState = { status: TaskStatus; index: number } | null;
const VISIBLE_TASK_BOARD_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

const TASK_STATUS_META: Record<
  TaskStatus,
  { icon: typeof FolderOpen; description: string; tone: string }
> = {
  backlog: {
    icon: FolderOpen,
    description: "Captured work that has not earned a scheduling decision yet.",
    tone: "text-zinc-400",
  },
  todo: {
    icon: ListTodo,
    description: "Ready next. Clear candidates for active execution.",
    tone: "text-zinc-200",
  },
  in_progress: {
    icon: PlayCircle,
    description: "Work currently consuming attention and time.",
    tone: "text-amber-400",
  },
  done: {
    icon: CheckCircle2,
    description: "Finished work kept visible long enough to close loops cleanly.",
    tone: "text-emerald-400",
  },
};

function getBoardOrder(task: DbTask, fallback: number): number {
  const n = Number(task.board_order);
  return Number.isFinite(n) ? n : fallback;
}

function getCreatedAtComparable(task: DbTask): string {
  const raw = task.created_at as unknown;
  if (raw instanceof Date) return raw.toISOString();
  if (typeof raw === "string") return raw;
  return String(raw ?? "");
}

function compareTasks(a: DbTask, b: DbTask): number {
  const boardDiff = getBoardOrder(a, 0) - getBoardOrder(b, 0);
  if (boardDiff !== 0) return boardDiff;

  if (a.due_date && b.due_date) {
    const dueDiff = a.due_date.localeCompare(b.due_date);
    if (dueDiff !== 0) return dueDiff;
  }

  if (a.due_date && !b.due_date) return -1;
  if (!a.due_date && b.due_date) return 1;

  return getCreatedAtComparable(a).localeCompare(getCreatedAtComparable(b));
}

function TaskStatusMeta({
  status,
}: {
  status: TaskStatus;
}) {
  const Icon = TASK_STATUS_META[status].icon;

  return (
    <span className="inline-flex items-center gap-1.5 type-body-sm text-zinc-400">
      <Icon size={12} className={cn("shrink-0", TASK_STATUS_META[status].tone)} />
      <span>{TASK_STATUS_LABELS[status]}</span>
    </span>
  );
}

function buildColumns(tasks: DbTask[]): TaskColumns {
  const columns: TaskColumns = {
    backlog: [],
    todo: [],
    in_progress: [],
    done: [],
  };

  for (const task of tasks) {
    const normalizedStatus = normalizeTaskStatusInput(task.status);
    const status = normalizedStatus === "backlog" ? "todo" : normalizedStatus;
    columns[status].push({ ...task, status });
  }

  for (const status of TASK_BOARD_STATUSES) {
    columns[status].sort(compareTasks);
  }

  return columns;
}

function computeBoardOrder(targetTasks: DbTask[], targetIndex: number): number {
  const prev = targetIndex > 0 ? getBoardOrder(targetTasks[targetIndex - 1], targetIndex) : null;
  const next = targetIndex < targetTasks.length ? getBoardOrder(targetTasks[targetIndex], targetIndex + 1) : null;

  if (prev !== null && next !== null) {
    const middle = (prev + next) / 2;
    if (Number.isFinite(middle) && middle > prev && middle < next) return middle;
    return prev + 0.0001;
  }

  if (prev !== null) return prev + 1;
  if (next !== null) return next - 1;
  return 1;
}

function moveTask(
  tasks: DbTask[],
  taskId: string,
  toStatus: TaskStatus,
  toIndex: number
): { nextData: DbTask[]; movedTask: DbTask } | null {
  const columns = buildColumns(tasks);
  let sourceStatus: TaskStatus | null = null;
  let sourceIndex = -1;

  for (const status of TASK_BOARD_STATUSES) {
    const idx = columns[status].findIndex((task) => task.id === taskId);
    if (idx !== -1) {
      sourceStatus = status;
      sourceIndex = idx;
      break;
    }
  }

  if (!sourceStatus || sourceIndex < 0) return null;

  const sourceTasks = [...columns[sourceStatus]];
  const [movingTask] = sourceTasks.splice(sourceIndex, 1);
  if (!movingTask) return null;

  const targetTasks = sourceStatus === toStatus ? sourceTasks : [...columns[toStatus]];
  let adjustedIndex = toIndex;
  if (sourceStatus === toStatus && toIndex > sourceIndex) {
    adjustedIndex -= 1;
  }

  const clampedIndex = Math.max(0, Math.min(adjustedIndex, targetTasks.length));
  if (sourceStatus === toStatus && clampedIndex === sourceIndex) return null;

  const boardOrder = computeBoardOrder(targetTasks, clampedIndex);
  const movedTask: DbTask = {
    ...movingTask,
    status: toStatus,
    board_order: boardOrder,
  };

  const nextData = tasks.map((task) => (task.id === taskId ? movedTask : task));
  return { nextData, movedTask };
}

function TaskCard({
  task,
  saving,
  onDragStart,
  onDragEnd,
  onOpenDetail,
}: {
  task: DbTask;
  saving: boolean;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onOpenDetail: (taskId: string) => void;
}) {
  const isDone = task.status === "done";
  const late = isTaskLate(task);
  const canOpenDetail = !isDone;
  const showMeta = !isDone && (Boolean(task.due_date) || Boolean(task.blocked_by) || Boolean(task.assigned_to));

  return (
    <div
      draggable={!saving}
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && canOpenDetail) {
          e.preventDefault();
          onOpenDetail(task.id);
        }
      }}
      onClick={() => {
        if (canOpenDetail) onOpenDetail(task.id);
      }}
      tabIndex={0}
      className={`group rounded-lg border border-zinc-800/60 bg-zinc-900/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/60 ${
        "p-2"
      } ${
        saving ? "opacity-60" : "cursor-grab active:cursor-grabbing"
      }`}
      aria-label={`Task ${task.title}. Drag to move.`}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className={`${isDone ? "mt-0" : "mt-1"} text-zinc-600 shrink-0`} />
        <div className="min-w-0 flex-1">
          <p className={`type-body-sm ${isDone ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
            {task.title}
          </p>
          {showMeta && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {task.assigned_to && (() => {
                const agent = getAgentMeta(task.assigned_to);
                return (
                  <Badge variant="status" shape="pill" className={cn("gap-0", agent.badge)}>
                    {agent.short}
                  </Badge>
                );
              })()}
              {task.due_date && (
                <Badge
                  variant={late ? "status" : "outline"}
                  shape="pill"
                  className={cn(
                    "gap-1",
                    late
                      ? "border-red-400/20 bg-red-400/10 text-red-400"
                      : "border-zinc-800/80 bg-zinc-900/60 text-zinc-400"
                  )}
                >
                  <Calendar size={10} />
                  {formatShortDate(task.due_date)}
                </Badge>
              )}
              {task.blocked_by && (
                <Badge variant="status" shape="pill" className="gap-1 border-orange-400/20 bg-orange-400/10 text-orange-300/80">
                  <CircleAlert size={10} />
                  waiting
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DropSlot({
  active,
  onDragOver,
  onDrop,
}: {
  active: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      className={`rounded transition-[height,background-color,border-color] duration-200 ${active ? "h-4 bg-teal-400/20 border border-teal-400/40" : "h-1"}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
}

export function TasksView({ initialData }: { initialData: DbTask[] }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<DragOverState>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const columns = useMemo(() => buildColumns(data), [data]);
  const detailTask = useMemo(
    () => (detailTaskId ? data.find((task) => task.id === detailTaskId) ?? null : null),
    [data, detailTaskId]
  );
  async function persistMove(task: DbTask) {
    const res = await fetch(`/api/admin/task/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: task.status,
        board_order: task.board_order,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to persist move");
    }
  }

  async function applyMove(taskId: string, toStatus: TaskStatus, toIndex: number) {
    if (savingTaskId) return;

    const previousData = data;
    const result = moveTask(previousData, taskId, toStatus, toIndex);
    if (!result) return;

    setError("");
    setData(result.nextData);
    setSavingTaskId(taskId);

    try {
      await persistMove(result.movedTask);
    } catch {
      setData(previousData);
      setError("Could not save task move. Try again.");
    } finally {
      setSavingTaskId(null);
      setDraggingTaskId(null);
      setDragOver(null);
    }
  }

  function handleDrop(status: TaskStatus, index: number, e: React.DragEvent) {
    e.preventDefault();
    if (!draggingTaskId) return;
    void applyMove(draggingTaskId, status, index);
  }

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setData(await res.json());
        setError("");
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <AdminPageIntro
        title="Tasks"
        subtitle="Move work across todo, active execution, and completed follow-through."
      />

      <Panel className="flex flex-col h-[calc(100svh-10rem)] overflow-hidden">

      {error && (
        <div className="px-4 py-2 border-b border-zinc-800/30">
          <p className="type-body-sm text-red-400/80">{error}</p>
        </div>
      )}

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <EmptyState icon={Calendar} message="No tasks yet." />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-x-auto p-3">
          <div className="grid h-full min-w-[840px] grid-cols-3 gap-3">
            {VISIBLE_TASK_BOARD_STATUSES.map((status) => {
              const tasks = columns[status];
              const Icon = TASK_STATUS_META[status].icon;
              return (
                <div
                  key={status}
                  className="flex h-full min-h-0 flex-col rounded-xl border border-zinc-800/50 bg-zinc-950/50"
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="border-b border-zinc-800/40 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className={cn("shrink-0", TASK_STATUS_META[status].tone)} />
                        <span className="type-body-sm font-medium text-zinc-100">{TASK_STATUS_LABELS[status]}</span>
                      </div>
                      <span className="type-body-sm text-zinc-500">{tasks.length}</span>
                    </div>
                    <p className="mt-2 type-body-sm text-zinc-500">
                      {TASK_STATUS_META[status].description}
                    </p>
                  </div>
                  <div className="p-2 space-y-1 min-h-0 overflow-y-auto">
                    {tasks.map((task, index) => (
                      <div key={task.id} className="space-y-1">
                        <DropSlot
                          active={dragOver?.status === status && dragOver.index === index}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggingTaskId) setDragOver({ status, index });
                          }}
                          onDrop={(e) => handleDrop(status, index, e)}
                        />
                        <TaskCard
                          task={task}
                          saving={savingTaskId === task.id}
                          onDragStart={(taskId) => {
                            setDraggingTaskId(taskId);
                            setError("");
                          }}
                          onDragEnd={() => {
                            setDraggingTaskId(null);
                            setDragOver(null);
                          }}
                          onOpenDetail={(taskId) => setDetailTaskId(taskId)}
                        />
                      </div>
                    ))}
                    <DropSlot
                      active={dragOver?.status === status && dragOver.index === tasks.length}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingTaskId) setDragOver({ status, index: tasks.length });
                      }}
                      onDrop={(e) => handleDrop(status, tasks.length, e)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Sheet open={Boolean(detailTask)} onOpenChange={(open) => !open && setDetailTaskId(null)}>
        <SheetContent side="right" className="w-full border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-lg">
          <SheetHeader className="border-b border-zinc-800/60 px-4 py-4">
            <SheetTitle className="text-lg font-medium leading-tight text-zinc-100">
              {detailTask?.title ?? "Task"}
            </SheetTitle>
            <SheetDescription className="mt-1">
              {detailTask ? (
                <>
                  <TaskStatusMeta status={normalizeTaskStatusInput(detailTask.status)} />
                  {detailTask.due_date && (() => {
                    const late = isTaskLate(detailTask);
                    return (
                      <>
                        <span className="mx-2 text-zinc-600">&bull;</span>
                        <span className={cn(
                          "inline-flex items-center gap-1.5 type-body-sm",
                          late ? "text-red-400" : "text-zinc-400"
                        )}>
                          <Calendar size={10} />
                          {formatShortDate(detailTask.due_date)}
                          {late && " — late"}
                        </span>
                      </>
                    );
                  })()}
                  {detailTask.blocked_by && (
                    <>
                      <span className="mx-2 text-zinc-600">&bull;</span>
                      <span className="inline-flex items-center gap-1.5 type-body-sm text-orange-300/80">
                        <CircleAlert size={10} />
                        Waiting
                      </span>
                    </>
                  )}
                  {detailTask.assigned_to && (
                    <>
                      <span className="mx-2 text-zinc-600">&bull;</span>
                      <span className="inline-flex items-center gap-1.5 type-body-sm text-zinc-400">
                        {getAgentMeta(detailTask.assigned_to).label}
                      </span>
                    </>
                  )}
                </>
              ) : null}
            </SheetDescription>
          </SheetHeader>
          {detailTask && (
            <div className="space-y-5 overflow-y-auto px-4 py-4">
              {isTaskLate(detailTask) && (
                <div className="rounded-lg border border-red-400/20 bg-red-400/8 px-4 py-3">
                  <p className="text-2xs font-medium uppercase tracking-[0.08em] text-red-400">Overdue</p>
                  <p className="mt-2 type-body-sm text-zinc-200">
                    Due {formatShortDate(detailTask.due_date)}
                  </p>
                </div>
              )}
              {detailTask.blocked_by && (
                <div className="rounded-lg border border-orange-400/20 bg-orange-400/8 px-4 py-3">
                  <p className="text-2xs font-medium uppercase tracking-[0.08em] text-orange-300/80">Waiting On</p>
                  <p className="mt-2 type-body-sm text-zinc-200">{detailTask.blocked_by}</p>
                </div>
              )}

              <div className="rounded-lg border border-zinc-800/70 bg-zinc-900/30 px-4 py-4">
                <p className="text-2xs font-medium uppercase tracking-[0.08em] text-zinc-500">Notes</p>
                <p className="mt-3 whitespace-pre-wrap type-body-sm text-zinc-300">
                  {detailTask.detail || "No notes added yet."}
                </p>
              </div>

              <div className="space-y-3 border-t border-zinc-800/50 pt-4">
                {detailTask.assigned_to && (
                  <TaskMetaRow label="Assigned To" value={getAgentMeta(detailTask.assigned_to).label} />
                )}
                <TaskMetaRow label="Updated" value={formatShortDateTime(detailTask.updated_at)} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Panel>
    </div>
  );
}

function TaskMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-2xs font-medium uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      <p className="type-body-sm text-right text-zinc-300">{value}</p>
    </div>
  );
}
