#!/usr/bin/env node
/**
 * One-shot cleanup for cron-polluted rows in the tasks board.
 *
 *   Dry run (default):   node scripts/purge-cron-tasks.mjs
 *   Actually delete:     PURGE=1 node scripts/purge-cron-tasks.mjs
 *
 * Needs:
 *   MOLTZART_BASE_URL   default https://moltzart.com
 *   INGEST_API_KEY      bearer token for /api/ingest/task*
 *
 * Strategy:
 *   1. Fetch todo + in_progress rows from the ingest API.
 *   2. Match titles against known cron-job name patterns.
 *   3. Write the candidate set to ./cron-task-purge-<ts>.json.
 *   4. If PURGE=1, DELETE each candidate.
 */

const BASE = process.env.MOLTZART_BASE_URL || "https://moltzart.com";
const KEY = process.env.INGEST_API_KEY;
if (!KEY) {
  console.error("INGEST_API_KEY env var is required");
  process.exit(1);
}

const CRON_TITLE_PATTERNS = [
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

function looksLikeCron(task) {
  if (task.source === "cron") return true;
  const title = task.title || "";
  return CRON_TITLE_PATTERNS.some((re) => re.test(title));
}

async function api(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${init.method || "GET"} ${path} → ${res.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  const todo = await api("/api/ingest/task?status=todo");
  const inProgress = await api("/api/ingest/task?status=in_progress");
  const all = [...todo, ...inProgress];
  console.log(`Fetched ${todo.length} todo + ${inProgress.length} in_progress rows`);

  const candidates = all.filter(looksLikeCron);
  console.log(`Candidates for deletion: ${candidates.length}`);

  if (candidates.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  const sample = candidates.slice(0, 10).map((t) => ({ id: t.id, title: t.title, status: t.status, assigned_to: t.assigned_to }));
  console.table(sample);

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `cron-task-purge-${ts}.json`;
  const fs = await import("node:fs/promises");
  await fs.writeFile(backupPath, JSON.stringify(candidates, null, 2));
  console.log(`Backup written to ${backupPath}`);

  if (process.env.PURGE !== "1") {
    console.log("\nDry run. Re-run with PURGE=1 to actually DELETE.");
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const t of candidates) {
    try {
      await api(`/api/ingest/task/${t.id}`, { method: "DELETE" });
      ok += 1;
    } catch (err) {
      failed += 1;
      console.error(`DELETE ${t.id} (${t.title}) failed:`, err.message);
    }
  }
  console.log(`Deleted ${ok}, failed ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
