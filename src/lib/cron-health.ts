import type { DbCronJob, DbJobRun } from "@/lib/db";

export type CronRunStatus = "success" | "error" | "missed" | "upcoming" | "running" | "unknown";

const TODAY_MISS_GRACE_MINUTES = 10;

export function parseCronField(field: string, min: number, max: number): number[] {
  if (field === "*") return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  if (field.startsWith("*/")) {
    const step = Number(field.slice(2));
    const values: number[] = [];
    for (let value = min; value <= max; value += step) values.push(value);
    return values;
  }
  if (field.includes(",")) return field.split(",").map(Number);
  if (field.includes("-")) {
    const [lo, hi] = field.split("-").map(Number);
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  }
  return [Number(field)];
}

export function cronMatchesDay(dowField: string, jsDay: number): boolean {
  const dows = parseCronField(dowField, 0, 6);
  return dows.includes(jsDay) || (jsDay === 0 && dows.includes(7));
}

export function isCronScheduledOnDate(expr: string, dateKey: string): boolean {
  const parts = expr.split(" ");
  if (parts.length < 5) return false;
  const [, , , , dowField] = parts;
  const d = new Date(`${dateKey}T12:00:00`);
  return cronMatchesDay(dowField, d.getDay());
}

export function isHighFrequencyCron(expr: string, weekDays: string[]): boolean {
  const [minField, hourField, , , dowField] = expr.split(" ");
  const minutes = parseCronField(minField, 0, 59);
  const hours = parseCronField(hourField, 0, 23);
  let total = 0;

  for (const day of weekDays) {
    const d = new Date(`${day}T12:00:00`);
    if (!cronMatchesDay(dowField, d.getDay())) continue;
    total += minutes.length * hours.length;
  }

  return total > 100;
}

export function estimateHighFrequencyIntervalMinutes(expr: string): number | null {
  const [minField, hourField, dayField, monthField, dowField] = expr.split(" ");
  if (dayField !== "*" || monthField !== "*" || dowField !== "*") return null;
  if (minField.startsWith("*/") && hourField === "*") return Number(minField.slice(2));
  if (minField === "0" && hourField === "*") return 60;
  return null;
}

function normalizeStatus(status: string | null | undefined): CronRunStatus | null {
  if (!status) return null;
  const normalized = status.toLowerCase();
  if (normalized === "success" || normalized === "ok" || normalized === "completed") return "success";
  if (normalized === "error" || normalized === "failed" || normalized === "failure") return "error";
  if (normalized === "running" || normalized === "in_progress") return "running";
  return null;
}

function sameDateKey(iso: string | null | undefined, dateKey: string): boolean {
  return Boolean(iso && iso.slice(0, 10) === dateKey);
}

export function scheduledTimeToUtc(dateKey: string, hour: number, minute: number, tz?: string): Date {
  const isoStr = `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  if (!tz) return new Date(isoStr);
  const utcDate = new Date(isoStr + "Z");
  const utcStr = utcDate.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = utcDate.toLocaleString("en-US", { timeZone: tz });
  const offsetMs = new Date(tzStr).getTime() - new Date(utcStr).getTime();
  return new Date(utcDate.getTime() - offsetMs);
}

export function getScheduledRunStatus(args: {
  job: DbCronJob;
  matchingRuns: DbJobRun[];
  dateKey: string;
  hour: number;
  minute: number;
  now?: Date;
  tz?: string;
}): { status: CronRunStatus; summary?: string } {
  const now = args.now ?? new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const scheduledAt = scheduledTimeToUtc(args.dateKey, args.hour, args.minute, args.tz || args.job.schedule_tz);
  const graceThreshold = scheduledAt.getTime() + TODAY_MISS_GRACE_MINUTES * 60_000;

  if (scheduledAt.getTime() > now.getTime()) {
    return { status: "upcoming" };
  }

  if (args.matchingRuns.length > 0) {
    const bestRun = args.matchingRuns[0];
    return {
      status: normalizeStatus(bestRun.status) ?? "success",
      summary: bestRun.summary || undefined,
    };
  }

  const snapshotStatus = normalizeStatus(args.job.last_status);
  if (sameDateKey(args.job.last_run_at, args.dateKey) && snapshotStatus) {
    return { status: snapshotStatus };
  }

  const syncedToday = sameDateKey(args.job.synced_at, todayKey);
  if (args.dateKey === todayKey && syncedToday && now.getTime() >= graceThreshold) {
    if (args.job.last_run_at || args.job.last_status) {
      return {
        status: "missed",
        summary: "Latest OpenClaw snapshot has no successful run for this slot today.",
      };
    }
  }

  if (args.job.last_run_at || args.job.last_status) {
    return {
      status: "unknown",
      summary: "OpenClaw snapshot has latest-run status only. This slot has no per-run telemetry.",
    };
  }

  return {
    status: "unknown",
    summary: "Cron telemetry has not been synced yet.",
  };
}

export function getTodayHealthStatus(job: DbCronJob, todayRuns: DbJobRun[], todayKey: string, now = new Date()): CronRunStatus {
  const matchingRuns = todayRuns.filter((run) => run.job_id === job.id);
  if (matchingRuns.length > 0) {
    return normalizeStatus(matchingRuns[0].status) ?? "success";
  }

  const snapshotStatus = normalizeStatus(job.last_status);
  if (sameDateKey(job.last_run_at, todayKey) && snapshotStatus) {
    return snapshotStatus;
  }

  const intervalMinutes = estimateHighFrequencyIntervalMinutes(job.schedule_expr);
  if (intervalMinutes && snapshotStatus && job.last_run_at) {
    const elapsed = now.getTime() - new Date(job.last_run_at).getTime();
    const allowedDelay = Math.max(intervalMinutes * 2, 90) * 60_000;
    if (elapsed <= allowedDelay) return snapshotStatus;
    if (sameDateKey(job.synced_at, todayKey)) return "missed";
  }

  if (sameDateKey(job.synced_at, todayKey) && isCronScheduledOnDate(job.schedule_expr, todayKey)) {
    return "unknown";
  }

  return "unknown";
}
