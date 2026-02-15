import { fetchNewsletterDigests } from "@/lib/db";
import { NewsletterView } from "@/components/newsletter-view";

export const dynamic = "force-dynamic";

export default async function AdminNewsletter() {
  const digests = await fetchNewsletterDigests();
  return <NewsletterView digests={digests} />;
}
