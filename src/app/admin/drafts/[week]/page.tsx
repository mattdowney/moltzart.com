import { notFound } from "next/navigation";
import { fetchXDraftsWeek } from "@/lib/db";
import { getWeekBounds } from "@/lib/newsletter-weeks";
import { DraftsView } from "@/components/drafts-view";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { MetricStrip } from "@/components/admin/metric-strip";

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
  const days = await fetchXDraftsWeek(start, end);

  const totalDrafts = days.reduce((sum, d) => sum + d.drafts.length, 0);

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Drafts" />

      <MetricStrip
        items={[
          { label: "Active Days", value: days.length, note: "Days with at least one draft in the selected week." },
          { label: "Drafts", value: totalDrafts, tone: "teal", note: "Total writing candidates in this batch." },
        ]}
        className="xl:grid-cols-2"
      />

      <DraftsView days={days} />
    </div>
  );
}
