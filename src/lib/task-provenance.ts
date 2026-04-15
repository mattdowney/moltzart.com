export type TaskSource = "human" | "agent" | "cron";

// Titles matching any of these patterns are always classified as `cron` regardless
// of client-claimed source or human-token presence. Keep in sync with the list in
// scripts/purge-cron-tasks.mjs. Additions are cheap; false-positives are correctable
// by operator PATCH in the admin UI.
export const CRON_TITLE_PATTERNS: RegExp[] = [
  /^newsletter[- ]intake[- ]drain/i,
  /^email[- ]poll/i,
  /^sigmund[- ]hourly[- ]ops/i,
  /^push[- ]cron[- ]telemetry/i,
  /^daily[- ]briefing/i,
  /^nightly[- ]memory[- ]distillation/i,
  /^behavioral[- ]autoresearch/i,
  /^job[- ]scout[- ]daily/i,
  /^morning[- ]writing[- ]nudge/i,
  /^weekly[- ]self[- ]audit/i,
  /^weekly[- ]newsletter[- ]digest/i,
  /^nightly[- ]backup/i,
  /^behavioral[- ]weekly[- ]report/i,
  /^scout[- ]/i,
  /-\d+[mh]$/i,
  /\bcron\b/i,
  /\bplaybook\b/i,
  /\bsweep\b/i,
  /\bautoresearch\b/i,
  /\bbriefing\b/i,
  /\bdistillation\b/i,
  /\bproactive\b/i,
  /\bstartup\b/i,
  /\bnightly\b/i,
  /\bweekly\b/i,
  /\bhourly\b/i,
];

export function titleMatchesCronPattern(title: string): boolean {
  return CRON_TITLE_PATTERNS.some((re) => re.test(title));
}

/**
 * Server-side authoritative classifier. Client-claimed `source` is ignored.
 *
 * Rules (evaluated in order):
 *   1. Title matches cron pattern → `cron`
 *   2. Human token header matches `INGEST_HUMAN_TOKEN` env → `human`
 *   3. Otherwise → `agent`
 *
 * The server-side title coercion (rule 1) ensures that even a leaked human token
 * cannot create cron-pattern rows on the operator board.
 */
export function resolveSource(params: {
  title: string;
  humanTokenHeader: string | null | undefined;
}): TaskSource {
  if (titleMatchesCronPattern(params.title)) return "cron";

  const humanToken = process.env.INGEST_HUMAN_TOKEN;
  if (humanToken && params.humanTokenHeader && params.humanTokenHeader === humanToken) {
    return "human";
  }

  return "agent";
}
