import { fetchDrafts } from "@/lib/github";
import { DraftsView } from "@/components/drafts-view";

export const dynamic = "force-dynamic";

export default async function AdminDrafts() {
  const { days, sha } = await fetchDrafts();

  const allDrafts = days.flatMap((d) => d.drafts);
  const pending = allDrafts.filter((d) => d.status === "pending").length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Drafts</h1>
        {pending > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">
            {pending} to review
          </span>
        )}
      </div>
      <DraftsView days={days} sha={sha} />
    </div>
  );
}
