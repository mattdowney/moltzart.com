import { fetchProjectsDb, fetchResearchArtifactsDb } from "@/lib/db";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { ResearchLibraryView } from "@/components/research-library-view";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const [artifacts, projects] = await Promise.all([
    fetchResearchArtifactsDb({ limit: 500 }),
    fetchProjectsDb(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Research" />

      <ResearchLibraryView artifacts={artifacts} projects={projects} />
    </div>
  );
}
