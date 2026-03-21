// src/lib/newsletter-weeks.ts

/**
 * Returns the Monday ISO date for the week containing isoDate.
 * Sat/Sun roll forward to the next Monday.
 */
export function getWeekMonday(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00Z");
  const day = d.getUTCDay(); // 0=Sun, 1=Mon … 6=Sat
  const offset = day === 0 ? 1 : day === 6 ? 2 : -(day - 1);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

/** Returns { start: monday, end: friday } for a given Monday ISO date. */
export function getWeekBounds(monday: string): { start: string; end: string } {
  const d = new Date(monday + "T12:00:00Z");
  const start = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 4);
  return { start, end: d.toISOString().slice(0, 10) };
}

/**
 * Returns the current date as an ISO string in America/New_York timezone.
 * Avoids UTC rollover causing the wrong week on late evenings.
 */
function getTodayET(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

/** Returns the Monday of the current week (based on ET, not UTC). */
export function getCurrentWeekMonday(): string {
  return getWeekMonday(getTodayET());
}

/**
 * Returns an array of ISO Monday dates surrounding the given Monday.
 * Includes `pastWeeks` weeks before and `futureWeeks` weeks after (inclusive of the anchor).
 * Sorted newest-first.
 */
export function getSurroundingWeeks(
  monday: string,
  pastWeeks = 3,
  futureWeeks = 2
): string[] {
  const anchor = new Date(monday + "T12:00:00Z");
  const weeks: string[] = [];
  for (let i = -pastWeeks; i <= futureWeeks; i++) {
    const d = new Date(anchor);
    d.setUTCDate(d.getUTCDate() + i * 7);
    weeks.push(d.toISOString().slice(0, 10));
  }
  return weeks.sort().reverse();
}

/**
 * Merges DB-sourced week list with surrounding weeks for the current/viewed week.
 * Ensures the dropdown always has navigable weeks regardless of DB data.
 * Returns sorted newest-first, deduped.
 */
export function mergeWeekLists(dbWeeks: string[], currentMonday: string): string[] {
  const surrounding = getSurroundingWeeks(currentMonday, 3, 2);
  const combined = new Set([...dbWeeks, ...surrounding]);
  return [...combined].sort().reverse();
}

/**
 * Formats a Monday ISO date as a human-readable label.
 * "2026-02-16" → "Feb 16–20, 2026"
 */
export function formatWeekLabel(monday: string): string {
  const d = new Date(monday + "T12:00:00Z");
  const friday = new Date(monday + "T12:00:00Z");
  friday.setUTCDate(friday.getUTCDate() + 4);
  const monMonth = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const friMonth = friday.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const fridayLabel =
    friMonth === monMonth
      ? `${friday.getUTCDate()}`
      : `${friMonth} ${friday.getUTCDate()}`;
  return `${monMonth} ${d.getUTCDate()}–${fridayLabel}, ${d.getUTCFullYear()}`;
}
