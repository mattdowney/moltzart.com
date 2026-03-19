export const AGENT_META = {
  matt: {
    label: "Matt",
    short: "MD",
    badge: "border-teal-400/20 bg-teal-400/10 text-teal-400",
  },
  moltzart: {
    label: "Moltzart",
    short: "MO",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  scout: {
    label: "Scout",
    short: "SC",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  pica: {
    label: "Pica",
    short: "PI",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  hawk: {
    label: "Hawk",
    short: "HK",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  sigmund: {
    label: "Sigmund",
    short: "SG",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  finch: {
    label: "Finch",
    short: "FI",
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-400",
  },
  system: {
    label: "Unassigned",
    short: "UN",
    badge: "border-zinc-700/60 bg-zinc-900/60 text-zinc-300",
  },
  unknown: {
    label: "Unknown",
    short: "??",
    badge: "border-zinc-700/60 bg-zinc-800/40 text-zinc-400",
  },
} as const;

export type AgentId = keyof typeof AGENT_META;

export function getAgentMeta(agentId: string | null | undefined) {
  if (!agentId) return AGENT_META.system;
  return AGENT_META[agentId as AgentId] ?? AGENT_META.unknown;
}
