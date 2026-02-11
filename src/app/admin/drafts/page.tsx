import { fetchDrafts, type Draft, type DraftDay } from "@/lib/github";
import { DraftsView } from "@/components/drafts-view";

export const dynamic = "force-dynamic";

export default async function AdminDrafts() {
  const { days, sha } = await fetchDrafts();

  // Count stats
  const allDrafts = days.flatMap((d) => d.drafts);
  const pending = allDrafts.filter((d) => d.status === "pending").length;
  const approved = allDrafts.filter((d) => d.status === "approved").length;
  const posted = allDrafts.filter((d) => d.status === "posted").length;
  const rejected = allDrafts.filter((d) => d.status === "rejected").length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Drafts</h1>
        <div className="flex gap-3 text-xs text-zinc-500">
          {pending > 0 && (
            <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
              {pending} pending
            </span>
          )}
          {approved > 0 && (
            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400">
              {approved} approved
            </span>
          )}
          <span>{posted} posted</span>
          <span>{rejected} rejected</span>
        </div>
      </div>

      {days.length === 0 ? (
        <p className="text-sm text-zinc-500">No drafts yet.</p>
      ) : (
        <DraftsView days={days} sha={sha} />
      )}
    </div>
  );
}
