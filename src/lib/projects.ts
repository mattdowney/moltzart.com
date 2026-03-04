import {
  Archive,
  Hammer,
  Lightbulb,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";

export const PROJECT_STATUSES = [
  "idea",
  "researching",
  "building",
  "launched",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_KINDS = [
  "general",
  "product",
] as const;

export type ProjectKind = (typeof PROJECT_KINDS)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

export function isProjectKind(value: string): value is ProjectKind {
  return (PROJECT_KINDS as readonly string[]).includes(value);
}

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; icon: LucideIcon; tone: string; bg: string }
> = {
  idea: { label: "Idea", icon: Lightbulb, tone: "text-amber-400", bg: "bg-amber-500/20" },
  researching: { label: "Researching", icon: Search, tone: "text-blue-400", bg: "bg-blue-500/20" },
  building: { label: "Building", icon: Hammer, tone: "text-violet-400", bg: "bg-violet-500/20" },
  launched: { label: "Launched", icon: Rocket, tone: "text-emerald-400", bg: "bg-emerald-500/20" },
  archived: { label: "Archived", icon: Archive, tone: "text-zinc-400", bg: "bg-zinc-500/20" },
};

export function toProjectSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\'\"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
