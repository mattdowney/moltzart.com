export const AGENT_META = {
  matt: {
    label: "Matt",
    short: "MD",
    badge: "border-teal-400/20 bg-teal-400/10 text-teal-400",
    glow: "teal-400",
  },
  moltzart: {
    label: "Moltzart",
    short: "MO",
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-400",
    glow: "violet-400",
  },
  scout: {
    label: "Scout",
    short: "SC",
    badge: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    glow: "blue-400",
  },
  pica: {
    label: "Pica",
    short: "PI",
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-400",
    glow: "rose-400",
  },
  hawk: {
    label: "Hawk",
    short: "HK",
    badge: "border-orange-400/20 bg-orange-400/10 text-orange-400",
    glow: "orange-400",
  },
  sigmund: {
    label: "Sigmund",
    short: "SG",
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    glow: "emerald-400",
  },
  finch: {
    label: "Finch",
    short: "FI",
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    glow: "amber-400",
  },
  system: {
    label: "Unassigned",
    short: "UN",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
    glow: "zinc-400",
  },
  unknown: {
    label: "Unknown",
    short: "??",
    badge: "border-zinc-700/60 bg-zinc-800/40 text-zinc-400",
    glow: "zinc-400",
  },
} as const;

export type AgentId = keyof typeof AGENT_META;

export function getAgentMeta(agentId: string | null | undefined) {
  if (!agentId) return AGENT_META.system;
  return AGENT_META[agentId as AgentId] ?? AGENT_META.unknown;
}

/** Map glow token (e.g. "teal-400") to an actual CSS color for use in inline styles */
const GLOW_COLORS: Record<string, string> = {
  "teal-400": "rgb(45 212 191)",
  "violet-400": "rgb(167 139 250)",
  "blue-400": "rgb(96 165 250)",
  "rose-400": "rgb(251 113 133)",
  "orange-400": "rgb(251 146 60)",
  "emerald-400": "rgb(52 211 153)",
  "amber-400": "rgb(251 191 36)",
  "zinc-400": "rgb(161 161 170)",
};

export function getGlowColor(glow: string): string {
  return GLOW_COLORS[glow] ?? "rgb(161 161 170)";
}
