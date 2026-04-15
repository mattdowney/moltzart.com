import { NextRequest, NextResponse } from "next/server";
import { fetchHumanTasksRaw } from "@/lib/db";
import { titleMatchesCronPattern } from "@/lib/task-provenance";

function checkCronAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === process.env.CRON_SECRET;
}

// Detects human-labeled rows whose titles match cron patterns — indicates either
// an INGEST_HUMAN_TOKEN leak or a legitimate task that was misclassified. Non-zero
// count warrants operator investigation. Alert channel is intentionally simple
// (Vercel log + JSON response) — add email/Slack hookup if noise volume justifies.
export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await fetchHumanTasksRaw();
  const bleeds = rows.filter((r) => titleMatchesCronPattern(r.title));

  if (bleeds.length > 0) {
    console.error(
      `[canary-human-cron-bleed] ALERT: ${bleeds.length} human-labeled cron-pattern row(s):`,
      bleeds.map((b) => `${b.id}:${b.title}`).join(", ")
    );
  }

  return NextResponse.json({
    ok: true,
    bleedCount: bleeds.length,
    bleeds: bleeds.map((b) => ({ id: b.id, title: b.title })),
  });
}
