"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import type { DbCronJob, DbJobRun } from "@/lib/db";

// --- Types ---

interface CalendarData {
  crons: DbCronJob[];
  jobRuns: DbJobRun[];
}

interface CalendarViewProps {
  initialData: CalendarData;
  initialStart: string;
}

type RunStatus = "success" | "error" | "missed" | "upcoming" | "running";

interface DayEvent {
  name: string;
  jobId: string;
  time: string;
  sortKey: string;
  colorIdx: number;
  status: RunStatus;
  summary?: string;
}

// --- Color palette for event cards ---

const CARD_COLORS = [
  "text-emerald-400",
  "text-amber-400",
  "text-blue-400",
  "text-rose-400",
  "text-purple-400",
  "text-teal-400",
  "text-orange-400",
  "text-cyan-400",
  "text-pink-400",
  "text-lime-400",
];

const PILL_COLORS = [
  "text-emerald-400/70 border-emerald-400/20",
  "text-amber-400/70 border-amber-400/20",
  "text-blue-400/70 border-blue-400/20",
  "text-rose-400/70 border-rose-400/20",
  "text-purple-400/70 border-purple-400/20",
  "text-teal-400/70 border-teal-400/20",
  "text-orange-400/70 border-orange-400/20",
  "text-cyan-400/70 border-cyan-400/20",
  "text-pink-400/70 border-pink-400/20",
  "text-lime-400/70 border-lime-400/20",
];

// --- Status indicator styles ---

const STATUS_INDICATOR: Record<RunStatus, { dot: string; border: string }> = {
  success: { dot: "bg-emerald-400", border: "border-emerald-400/20" },
  error: { dot: "bg-red-400", border: "border-red-400/20" },
  missed: { dot: "bg-amber-400", border: "border-amber-400/20" },
  running: { dot: "bg-blue-400 animate-pulse", border: "border-blue-400/20" },
  upcoming: { dot: "bg-zinc-600", border: "border-zinc-800/40" },
};

// --- Date helpers (Monday-start week) ---

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}

function getWeekDays(startDate: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

/** Get Monday of the week containing dateStr */
function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  // Monday=0 offset: Sun(0)->-6, Mon(1)->0, Tue(2)->-1, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return fmtDate(d);
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${h12}:00 ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatTimeSortKey(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatWeekLabel(startDate: string): string {
  const start = new Date(startDate + "T12:00:00");
  const end = new Date(startDate + "T12:00:00");
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (start.getMonth() !== end.getMonth()) {
    return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}, ${start.getFullYear()}`;
  }
  return `${start.toLocaleDateString("en-US", { month: "short" })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
}

// --- Cron field parser (bypasses cron-parser DST bug) ---

function parseCronField(field: string, min: number, max: number): number[] {
  if (field === "*") return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  if (field.startsWith("*/")) {
    const step = parseInt(field.slice(2));
    const result: number[] = [];
    for (let i = min; i <= max; i += step) result.push(i);
    return result;
  }
  if (field.includes(",")) return field.split(",").map(Number);
  if (field.includes("-")) {
    const [lo, hi] = field.split("-").map(Number);
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  }
  return [parseInt(field)];
}

function cronMatchesDay(dowField: string, jsDay: number): boolean {
  // JS: 0=Sun, cron: 0=Sun (or 7=Sun)
  const dows = parseCronField(dowField, 0, 6);
  return dows.includes(jsDay) || (jsDay === 0 && dows.includes(7));
}

function formatHM(h: number, m: number): string {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${h12}:00 ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function sortKeyHM(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

interface CronRun {
  dateKey: string;
  hour: number;
  minute: number;
}

function expandCron(expr: string, weekDays: string[]): CronRun[] {
  const [minField, hourField, , , dowField] = expr.split(" ");
  const minutes = parseCronField(minField, 0, 59);
  const hours = parseCronField(hourField, 0, 23);
  const runs: CronRun[] = [];

  for (const dayStr of weekDays) {
    const d = new Date(dayStr + "T12:00:00");
    if (!cronMatchesDay(dowField, d.getDay())) continue;
    for (const h of hours) {
      for (const m of minutes) {
        runs.push({ dateKey: dayStr, hour: h, minute: m });
      }
    }
  }
  return runs;
}

// --- Cron expansion with run status ---

interface AlwaysRunningJob {
  name: string;
  frequency: string;
  colorIdx: number;
}

function categorizeCrons(
  crons: DbCronJob[],
  jobRuns: DbJobRun[],
  weekDays: string[]
): { alwaysRunning: AlwaysRunningJob[]; scheduled: Map<string, DayEvent[]> } {
  const alwaysRunning: AlwaysRunningJob[] = [];
  const scheduled = new Map<string, DayEvent[]>();
  const todayStr = fmtDate(new Date());
  const nowH = new Date().getHours();
  const nowM = new Date().getMinutes();

  // Index job runs by job_id + date for quick lookup
  const runIndex = new Map<string, DbJobRun[]>();
  for (const run of jobRuns) {
    const dateKey = run.started_at.slice(0, 10);
    const key = `${run.job_id}:${dateKey}`;
    if (!runIndex.has(key)) runIndex.set(key, []);
    runIndex.get(key)!.push(run);
  }

  // Build stable color map
  const colorMap = new Map<string, number>();
  const sortedNames = [...new Set(crons.map((j) => j.name))].sort();
  sortedNames.forEach((name, i) => colorMap.set(name, i % CARD_COLORS.length));

  for (const job of crons) {
    if (!job.enabled) continue;
    const colorIdx = colorMap.get(job.name) ?? 0;

    const weekRuns = expandCron(job.schedule_expr, weekDays);

    if (weekRuns.length > 100) {
      const perDay = Math.round(weekRuns.length / 7);
      const freq = perDay >= 24 ? `Every ${Math.round((24 * 60) / perDay)} min` : `${perDay}x daily`;
      alwaysRunning.push({ name: job.name, frequency: freq, colorIdx });
      continue;
    }

    for (const run of weekRuns) {
      if (!scheduled.has(run.dateKey)) scheduled.set(run.dateKey, []);

      const matchKey = `${job.id}:${run.dateKey}`;
      const matchingRuns = runIndex.get(matchKey) || [];
      let status: RunStatus;
      let summary: string | undefined;

      const isFuture = run.dateKey > todayStr ||
        (run.dateKey === todayStr && (run.hour > nowH || (run.hour === nowH && run.minute > nowM)));

      if (isFuture) {
        status = "upcoming";
      } else if (matchingRuns.length > 0) {
        const bestRun = matchingRuns[0];
        status = bestRun.status as RunStatus;
        if (status !== "success" && status !== "error" && status !== "running") {
          status = "success";
        }
        summary = bestRun.summary || undefined;
      } else {
        status = "missed";
      }

      scheduled.get(run.dateKey)!.push({
        name: job.name,
        jobId: job.id,
        time: formatHM(run.hour, run.minute),
        sortKey: sortKeyHM(run.hour, run.minute),
        colorIdx,
        status,
        summary,
      });
    }
  }

  for (const [, events] of scheduled) {
    events.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }

  return { alwaysRunning, scheduled };
}

// --- Component ---

export function CalendarView({ initialData, initialStart }: CalendarViewProps) {
  const [data, setData] = useState<CalendarData>(initialData);
  const [weekStart, setWeekStart] = useState(initialStart);
  const [loading, setLoading] = useState(false);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const todayKey = fmtDate(new Date());

  const loadWeek = useCallback(async (start: string) => {
    setWeekStart(start);
    setLoading(true);
    try {
      const end = addDays(start, 6);
      const res = await fetch(`/api/admin/calendar?start=${start}&end=${end}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const goPrev = useCallback(() => loadWeek(addDays(weekStart, -7)), [weekStart, loadWeek]);
  const goNext = useCallback(() => loadWeek(addDays(weekStart, 7)), [weekStart, loadWeek]);
  const refresh = useCallback(() => loadWeek(weekStart), [weekStart, loadWeek]);

  const { alwaysRunning, scheduled } = useMemo(
    () => categorizeCrons(data.crons, data.jobRuns, weekDays),
    [data.crons, data.jobRuns, weekDays]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Calendar</h1>
          <p className="text-sm text-zinc-500">{formatWeekLabel(weekStart)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={refresh} className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800/50 transition-colors">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={goPrev} className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800/50 transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={goNext} className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800/50 transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Always On + Legend row */}
      <div className="flex items-center justify-between gap-4">
        {alwaysRunning.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 shrink-0">Always on</span>
            <div className="flex flex-wrap gap-1.5">
              {alwaysRunning.map((job) => (
                <span
                  key={job.name}
                  className="inline-flex items-center rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-900/50"
                >
                  {job.name} · {job.frequency}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-zinc-500 shrink-0 ml-auto">
          <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-emerald-400" /> Ran</span>
          <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-red-400" /> Error</span>
          <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-amber-400" /> Missed</span>
          <span className="flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-zinc-600" /> Upcoming</span>
        </div>
      </div>

      {/* Weekly columns */}
      <div className={`rounded-lg border border-zinc-800/50 overflow-hidden ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-7 gap-px bg-zinc-800/30">
          {weekDays.map((dateKey, idx) => {
            const d = new Date(dateKey + "T12:00:00");
            const isToday = dateKey === todayKey;
            const isPast = dateKey < todayKey;
            const events = scheduled.get(dateKey) || [];

            return (
              <div key={dateKey} className={`bg-zinc-950 flex flex-col min-h-0 ${isPast ? "opacity-50" : ""}`}>
                {/* Day header */}
                <div className={`px-3 py-2.5 border-b border-zinc-800/50 flex items-center justify-between ${isToday ? "bg-zinc-900/50" : ""}`}>
                  <span className={`text-sm font-semibold ${isToday ? "text-teal-400" : "text-zinc-300"}`}>
                    {WEEKDAYS[idx]}
                  </span>
                  <span className={`text-sm ${isToday ? "text-teal-400/70" : "text-zinc-600"}`}>
                    {d.getDate()}
                  </span>
                </div>

                {/* Event cards */}
                <div className="flex-1 p-1.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-20rem)]">
                  {events.map((ev, i) => (
                    <EventCard key={`${ev.jobId}-${ev.sortKey}-${i}`} event={ev} />
                  ))}
                  {events.length === 0 && (
                    <div className="text-xs text-zinc-700 text-center py-4">—</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
}

function EventCard({ event }: { event: DayEvent }) {
  const colorClass = CARD_COLORS[event.colorIdx];
  const si = STATUS_INDICATOR[event.status];

  return (
    <div
      className={`rounded-md bg-zinc-900/80 border px-2.5 py-2 ${si.border}`}
      title={event.summary || undefined}
    >
      <div className="flex items-center gap-1.5">
        <span className={`inline-block size-1.5 rounded-full shrink-0 ${si.dot}`} />
        <span className={`text-xs font-medium truncate ${colorClass}`}>
          {event.name}
        </span>
      </div>
      <div className="text-[10px] text-zinc-500 mt-0.5 pl-3">
        {event.time}
      </div>
    </div>
  );
}
