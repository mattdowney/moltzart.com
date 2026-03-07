import { fetchProjectsDb } from "@/lib/db";
import { ProjectsView } from "@/components/projects-view";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await fetchProjectsDb({ includeArchived: true });

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Projects" />

      <ProjectsView projects={projects} />
    </div>
  );
}
