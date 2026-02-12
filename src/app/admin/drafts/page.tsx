import { fetchDrafts } from "@/lib/github";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDrafts() {
  const { days } = await fetchDrafts();

  const allDrafts = days.flatMap((d) => d.drafts);
  const pending = allDrafts.filter((d) => d.status === "pending").length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Drafts</h1>
        {pending > 0 && (
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
            {pending} to review
          </Badge>
        )}
      </div>

      {days.length === 0 ? (
        <p className="text-sm text-zinc-500">No drafts yet.</p>
      ) : (
        <div className="space-y-1">
          {days.map((day) => {
            const dayPending = day.drafts.filter((d) => d.status === "pending").length;
            const dayPosted = day.drafts.filter((d) => d.status === "posted").length;
            const dayApproved = day.drafts.filter((d) => d.status === "approved").length;

            return (
              <Link
                key={day.date}
                href={`/admin/drafts/${day.date}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">
                    {day.label}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {day.drafts.length} draft{day.drafts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {dayPending > 0 && (
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[11px]">
                      {dayPending} pending
                    </Badge>
                  )}
                  {dayApproved > 0 && (
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 text-[11px]">
                      {dayApproved} approved
                    </Badge>
                  )}
                  {dayPosted > 0 && (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[11px]">
                      {dayPosted} posted
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
