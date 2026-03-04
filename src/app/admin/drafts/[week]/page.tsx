import { notFound } from "next/navigation";
import { fetchXDraftsWeek, fetchXDraftWeekStarts } from "@/lib/db";
import { getWeekBounds, formatWeekLabel } from "@/lib/newsletter-weeks";
import { DraftsView } from "@/components/drafts-view";
import { WeekSelector } from "@/components/week-selector";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ week: string }>;
}

export default async function DraftsWeekPage({ params }: Props) {
  const { week } = await params;

  const parsed = new Date(week + "T12:00:00Z");
  if (isNaN(parsed.getTime()) || parsed.getUTCDay() !== 1) {
    notFound();
  }

  const { start, end } = getWeekBounds(week);
  const [days, weekStarts] = await Promise.all([
    fetchXDraftsWeek(start, end),
    fetchXDraftWeekStarts(),
  ]);

  const totalDrafts = days.reduce((sum, d) => sum + d.drafts.length, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Drafts">
        {weekStarts.length > 0 ? (
          <WeekSelector currentWeek={week} availableWeeks={weekStarts} basePath="/admin/drafts" />
        ) : (
          <span className="type-body-sm text-zinc-500">{formatWeekLabel(week)}</span>
        )}
        <span className="type-body-sm text-zinc-500">{totalDrafts} drafts</span>
      </PageHeader>
      <DraftsView days={days} />
    </div>
  );
}
