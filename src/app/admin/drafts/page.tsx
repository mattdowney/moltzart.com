import { fetchDrafts } from "@/lib/db";
import { AllDraftsView } from "@/components/drafts-view";

export const dynamic = "force-dynamic";

export default async function AdminDrafts() {
  const { days } = await fetchDrafts();
  const allDrafts = days.flatMap((d) => d.drafts);

  return (
    <div>
      <AllDraftsView drafts={allDrafts} />
    </div>
  );
}
