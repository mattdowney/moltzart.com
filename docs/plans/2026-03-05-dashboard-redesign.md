# Dashboard Redesign

## Problem

The current dashboard has no focusing mechanism. MetricStrip dominates with decorative numbers, newsletter data appears three times, the "Now" panel wastes space when empty (the common state), and five components compete for attention with no clear priority. Mixed card styles (3 different border-radius values, 3 surface colors) add visual noise.

## Design

Single column, priority-stacked. Every element earns its vertical space.

### 1. Page Header

"Dashboard" title only. No subtitle, no meta line. The content below is the orientation.

### 2. Action Queue (Panel)

The primary section. A single Panel with title "Action Queue" (no description). Shows tasks that need the operator, ordered by priority:

1. Blocked tasks (amber dot) — stalled, need unblocking
2. Urgent tasks (pulsing urgent dot) — flagged priority
3. Ready next (tasks in `todo` status) — the pick-up queue

Each row: status dot + task title + subtle badge ("blocked" / "urgent" / "ready"). Click navigates to `/admin/tasks`.

Empty state: single line "Nothing needs attention right now." — no illustration, no paragraph.

Cap at 8 rows. "View all tasks" link at bottom if more exist.

### 3. Health Strip

Compact horizontal row of inline health signals inside a subtle container:

```
Agents: 12/13 on schedule  ·  Blocked: 0  ·  Completion: 95%
```

Each segment: colored dot/value + text. Green when healthy, amber/red when not. Each segment links to the relevant page (agents -> calendar, blocked -> tasks, completion -> tasks).

Not a MetricStrip — reads like a sentence, not a widget grid.

### 4. Recent Activity

One compact line at the bottom. Latest system event with timestamp and link arrow:

```
Latest: 4 newsletter picks landed · 2026-03-05    ->
```

Pulls the most recent meaningful event (new digest, new research, agent run). Single latest only. Doesn't render when nothing recent.

## What Gets Removed

- MetricStrip (4 large number cards)
- Newsletter Picks panel (full article list with colored badges)
- "Latest" panel (nested card duplicating newsletter data)
- All panel descriptions/subtitles
- Page header subtitle and meta line

## Data Sources

- `fetchTasksDb()` — blocked, urgent, and todo tasks for action queue + health strip completion/blocked counts
- `fetchJobRunsForRange()` — agent health (on-schedule count) for health strip
- `fetchNewsletterArticlesDb()` — latest digest date/count for recent activity line
- Could extend recent activity to include latest research artifact

## Components Used

- `AdminPageIntro` (title only)
- `Panel` + `PanelHeader` (action queue)
- `StatusDot` (task rows)
- `Badge` (row context labels)
- New: inline health strip (simple div with text spans, not a new component)
- New: recent activity line (simple div, not a new component)
