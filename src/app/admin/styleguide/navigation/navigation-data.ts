import { Bell, Bolt, FolderKanban, Inbox, Layers3, Search, Settings, Sparkles } from "lucide-react";

export const TIMING = {
  indicatorSettle: 120,
  contentEnter: 180,
} as const;

export const MOTION = {
  enter: { duration: TIMING.contentEnter / 1000, ease: [0.16, 1, 0.3, 1] as const },
  exit: { duration: TIMING.indicatorSettle / 1000, ease: [0.7, 0, 0.84, 0] as const },
  indicator: { type: "spring" as const, stiffness: 460, damping: 34, mass: 0.8 },
} as const;

export const SEGMENT_ITEMS = [
  { value: "overview", label: "Overview", icon: Sparkles },
  { value: "queue", label: "Queue", icon: Inbox },
  { value: "settings", label: "Settings", icon: Settings },
] as const;

export const RAIL_SPECS = [
  {
    name: "Compact",
    rail: "28px",
    trigger: "px-3 / gap-1.5 / text-xs",
    icon: "12px",
    use: "Dense in-panel switching, utility drawers, secondary rails.",
    listClassName: "h-7 bg-zinc-900/70 p-0.5",
    triggerClassName:
      "px-3 text-xs gap-1.5 data-[state=active]:bg-zinc-50 data-[state=active]:text-zinc-950 [&_svg]:size-3",
  },
  {
    name: "Default",
    rail: "32px",
    trigger: "px-3 / gap-2 / text-sm",
    icon: "14px",
    use: "Standard page and panel tabs. This should be the default system choice.",
    listClassName: "h-8 bg-zinc-900/70 p-0.5",
    triggerClassName:
      "px-3 text-xs gap-1.5 data-[state=active]:bg-zinc-50 data-[state=active]:text-zinc-950 [&_svg]:size-3",
  },
  {
    name: "Roomy",
    rail: "36px",
    trigger: "px-4 / gap-2 / text-xs",
    icon: "14px",
    use: "Top-level rails with more breathing room, usually line tabs rather than filled pills.",
    listClassName: "h-9 bg-zinc-900/70 p-0.5",
    triggerClassName:
      "px-4 text-xs gap-1.5 data-[state=active]:bg-zinc-50 data-[state=active]:text-zinc-950 [&_svg]:size-3",
  },
] as const;

export const SPACING_RULES = [
  { token: "rail height", value: "28 / 32 / 36", note: "Pick one of three sizes. Do not improvise a fourth." },
  { token: "outer padding", value: "p-0.5", note: "Enough room for the active fill to breathe inside the rail." },
  { token: "trigger padding", value: "px-3 or px-4", note: "Horizontal padding should come from the rail size, not the label length." },
  { token: "trigger gap", value: "gap-1.5", note: "Icon and label spacing stays tight to keep the rail calm." },
  { token: "icon size", value: "12px", note: "Tabs use the smaller end of the system. Button icon rules live on the Buttons page." },
  { token: "label wrapping", value: "nowrap", note: "If labels wrap, the taxonomy is already broken." },
] as const;

export const COUNT_PATTERNS = [
  {
    title: "Two Items",
    note: "Binary section switch. Use for clear mode changes, not filters.",
    defaultValue: "active",
    items: [
      { value: "active", label: "Active" },
      { value: "archived", label: "Archived" },
    ],
  },
  {
    title: "Three Items",
    note: "Good default for small content families.",
    defaultValue: "overview",
    items: [
      { value: "overview", label: "Overview" },
      { value: "activity", label: "Activity" },
      { value: "history", label: "History" },
    ],
  },
  {
    title: "Four Items",
    note: "Works when labels are short and the content model is stable.",
    defaultValue: "all",
    items: [
      { value: "all", label: "All" },
      { value: "ideas", label: "Ideas" },
      { value: "drafts", label: "Drafts" },
      { value: "scheduled", label: "Scheduled" },
    ],
  },
  {
    title: "Five Items",
    note: "Upper bound for fixed tabs on desktop. Past this, switch to overflow or another nav model.",
    defaultValue: "inbox",
    items: [
      { value: "inbox", label: "Inbox" },
      { value: "ready", label: "Ready" },
      { value: "review", label: "Review" },
      { value: "published", label: "Published" },
      { value: "archive", label: "Archive" },
    ],
  },
] as const;

export const CONTENT_STATES = [
  {
    value: "overview",
    label: "Overview",
    title: "Weekly snapshot",
    body: "Primary tabs should reframe the workspace, not just restyle the same list.",
    meta: "summary layer",
    icon: Sparkles,
  },
  {
    value: "queue",
    label: "Queue",
    title: "Action queue",
    body: "When the user changes tabs, the next panel should slide into place quickly and keep the same spatial footprint.",
    meta: "execution layer",
    icon: Inbox,
  },
  {
    value: "settings",
    label: "Settings",
    title: "System settings",
    body: "Use tabs to separate sibling sections with equal importance. If one tab becomes a junk drawer, the taxonomy is wrong.",
    meta: "configuration layer",
    icon: Settings,
  },
] as const;

export const OVERFLOW_ITEMS = [
  { value: "all", label: "All Posts", icon: Layers3 },
  { value: "research", label: "Research Notes", icon: Search },
  { value: "projects", label: "Project Updates", icon: FolderKanban },
  { value: "alerts", label: "Agent Alerts", icon: Bell },
  { value: "experiments", label: "Experiments", icon: Bolt },
  { value: "settings", label: "Workspace Settings", icon: Settings },
] as const;

export const MOTION_RULES = [
  {
    layer: "indicator",
    timing: "120ms",
    spec: "opacity + transform only",
    note: "The active state should lock quickly so the rail feels decisive.",
  },
  {
    layer: "content",
    timing: "180ms",
    spec: "opacity + y + subtle scale",
    note: "Content should settle under the rail, not leap or bounce.",
  },
  {
    layer: "press",
    timing: "immediate",
    spec: "color shift only",
    note: "Tabs are navigation, not call-to-action buttons. Avoid button-like squash.",
  },
] as const;

export const RULES = [
  "Tabs switch between sibling sections at the same hierarchy level.",
  "Two to four items is ideal. Five is acceptable if labels stay short.",
  "Past five items, prefer horizontal overflow, secondary grouping, or a different navigation model.",
  "Use one or two words per tab. Long labels are an information architecture problem, not a styling problem.",
  "Keep the tab bar fixed in size while content changes beneath it.",
] as const;
