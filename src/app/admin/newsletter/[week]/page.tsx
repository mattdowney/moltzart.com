// src/app/admin/newsletter/[week]/page.tsx
import { notFound } from "next/navigation";
import { fetchNewsletterWeek, fetchNewsletterWeekStarts } from "@/lib/db";
import { getWeekBounds, formatWeekLabel } from "@/lib/newsletter-weeks";
import { NewsletterView } from "@/components/newsletter-view";
import { WeekSelector } from "@/components/week-selector";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ week: string }>;
}

export default async function NewsletterWeekPage({ params }: Props) {
  const { week } = await params;

  // Validate: must be a valid date that is a Monday (getUTCDay() === 1)
  const parsed = new Date(week + "T12:00:00Z");
  if (isNaN(parsed.getTime()) || parsed.getUTCDay() !== 1) {
    notFound();
  }

  const { start, end } = getWeekBounds(week);
  const [digests, weekStarts] = await Promise.all([
    fetchNewsletterWeek(start, end),
    fetchNewsletterWeekStarts(),
  ]);

  const totalArticles = digests.reduce((sum, d) => sum + d.articles.length, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Newsletter">
        {weekStarts.length > 0 ? (
          <WeekSelector currentWeek={week} availableWeeks={weekStarts} basePath="/admin/newsletter" />
        ) : (
          <span className="type-body-sm text-zinc-500">{formatWeekLabel(week)}</span>
        )}
        <span className="type-body-sm text-zinc-500">{totalArticles} articles</span>
      </PageHeader>
      <NewsletterView digests={digests} />
    </div>
  );
}
