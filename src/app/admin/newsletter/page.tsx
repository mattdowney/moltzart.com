import { fetchNewsletterDigests } from "@/lib/github";
import { NewsletterView } from "@/components/newsletter-view";

export const dynamic = "force-dynamic";

export default async function AdminNewsletter() {
  const digests = await fetchNewsletterDigests();
  return <NewsletterView digests={digests} />;
}
