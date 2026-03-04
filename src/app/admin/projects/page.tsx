import { fetchProjectsDb } from "@/lib/db";
import { ProjectsView } from "@/components/projects-view";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await fetchProjectsDb({ includeArchived: true });

  return (
    <div className="space-y-4">
      <PageHeader title="Projects">
        <span className="type-body-sm text-zinc-500">{projects.length} total</span>
      </PageHeader>

      <ProjectsView projects={projects} />
    </div>
  );
}
