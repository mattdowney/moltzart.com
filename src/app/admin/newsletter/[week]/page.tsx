import { notFound } from "next/navigation";
import { fetchNewsletterWeek, fetchNewsletterWeekStarts } from "@/lib/db";
import { getWeekBounds, formatWeekLabel, mergeWeekLists } from "@/lib/newsletter-weeks";
import { PageHeader } from "@/components/admin/page-header";
import { WeekSelector } from "@/components/week-selector";
import { NewsletterArticlesTable } from "@/components/newsletter-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ week: string }>;
}

export default async function NewsletterWeekPage({ params }: Props) {
  const { week } = await params;

  const parsed = new Date(week + "T12:00:00Z");
  if (isNaN(parsed.getTime()) || parsed.getUTCDay() !== 1) {
    notFound();
  }

  const { start, end } = getWeekBounds(week);
  const [digests, dbWeeks] = await Promise.all([
    fetchNewsletterWeek(start, end),
    fetchNewsletterWeekStarts(),
  ]);
  // Always include surrounding weeks so the dropdown is never empty,
  // even when viewing a week with no newsletter data yet.
  const availableWeeks = mergeWeekLists(dbWeeks, week);

  // Flatten digests into a single article array with day info attached
  const articles = digests.flatMap((d) =>
    d.articles.map((a) => ({
      ...a,
      digestDate: d.date,
      dayLabel: d.label,
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        breadcrumbs={[
          { label: "Newsletter", href: "/admin/newsletter/editions" },
          { label: formatWeekLabel(week) },
        ]}
      >
        <WeekSelector
          currentWeek={week}
          availableWeeks={availableWeeks}
          basePath="/admin/newsletter"
        />
      </PageHeader>
      <NewsletterArticlesTable articles={articles} weekMonday={week} />
    </div>
  );
}
