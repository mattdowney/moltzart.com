// src/app/admin/newsletter/[week]/page.tsx
import { notFound } from "next/navigation";
import { fetchNewsletterWeek } from "@/lib/db";
import { getWeekBounds } from "@/lib/newsletter-weeks";
import { NewsletterView } from "@/components/newsletter-view";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { MetricStrip } from "@/components/admin/metric-strip";

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
  const digests = await fetchNewsletterWeek(start, end);

  const totalArticles = digests.reduce((sum, d) => sum + d.articles.length, 0);

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Newsletter" />

      <MetricStrip
        items={[
          { label: "Digest Days", value: digests.length, note: "Days with newsletter picks this week." },
          { label: "Articles", value: totalArticles, tone: "teal", note: "Total picks across the selected week." },
        ]}
        className="xl:grid-cols-2"
      />

      <NewsletterView digests={digests} />
    </div>
  );
}
