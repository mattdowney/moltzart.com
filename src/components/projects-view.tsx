"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, ChevronRight, FolderKanban, Rocket } from "lucide-react";
import type { DbProject } from "@/lib/db";
import type { ProjectStatus } from "@/lib/projects";
import { STATUS_META } from "@/lib/projects";
import { CollectionPanel } from "@/components/admin/collection-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { KindTag } from "@/components/admin/tag-badge";
import { MetricStrip } from "@/components/admin/metric-strip";
import { SectionTabs } from "@/components/admin/section-tabs";
import { formatShortDate } from "@/lib/date-format";

const ACTIVE_STATUSES: ProjectStatus[] = ["idea", "researching", "building"];

const STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  idea: "Early projects that still need their shape and constraints sharpened.",
  researching: "Projects actively gathering evidence before they commit to build shape.",
  building: "Live efforts with enough conviction to ship against.",
  launched: "Finished work that defines the standard for what done should feel like.",
  archived: "Dormant or retired work that should stop competing with the active pipeline.",
};

type ProjectsTab = "active" | "launched" | "archive";

export function ProjectsView({ projects }: { projects: DbProject[] }) {
  const [activeTab, setActiveTab] = useState<ProjectsTab>("active");
  const activeProjects = useMemo(
    () => projects.filter((project) => ACTIVE_STATUSES.includes(project.status)),
    [projects]
  );
  const launchedProjects = useMemo(
    () => projects.filter((project) => project.status === "launched"),
    [projects]
  );
  const archivedProjects = useMemo(
    () => projects.filter((project) => project.status === "archived"),
    [projects]
  );

  if (projects.length === 0) {
    return <EmptyState icon={Briefcase} message="No projects yet." />;
  }

  const activeCount = projects.filter((project) => project.status !== "archived").length;
  const launchedCount = projects.filter((project) => project.status === "launched").length;
  const researchCount = projects.reduce((sum, project) => sum + project.artifact_count, 0);

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          {
            label: "Project Inventory",
            value: projects.length,
            note: "All projects in the system.",
          },
          {
            label: "Active Pipeline",
            value: activeCount,
            tone: "teal",
            note: `${researchCount} linked research artifacts are informing current work.`,
          },
          {
            label: "Launched",
            value: launchedCount,
            tone: "green",
            note: "Reference bar for what finished work should contain.",
          },
        ]}
        className="xl:grid-cols-3"
      />

      <SectionTabs
        items={[
          { id: "active", label: "Active", count: activeProjects.length },
          { id: "launched", label: "Launched", count: launchedProjects.length },
          { id: "archive", label: "Archive", count: archivedProjects.length },
        ]}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProjectsTab)}
      />

      {activeTab === "active" && (
        <div className="space-y-4">
          {ACTIVE_STATUSES.map((status) => {
            const items = projects.filter((project) => project.status === status);
            if (items.length === 0) return null;
            const Icon = STATUS_META[status].icon;

            return (
              <CollectionPanel
                key={status}
                icon={Icon}
                title={STATUS_META[status].label}
                description={STATUS_DESCRIPTIONS[status]}
                count={items.length}
                countLabel={items.length === 1 ? "project" : "projects"}
                iconClassName={STATUS_META[status].tone}
                titleClassName={STATUS_META[status].tone}
                className="overflow-hidden"
                bodyClassName="border-t border-zinc-800/30"
              >
                <ProjectRows projects={items} />
              </CollectionPanel>
            );
          })}
        </div>
      )}

      {activeTab === "launched" && (
        launchedProjects.length > 0 ? (
          <CollectionPanel
            icon={Rocket}
            title="Launched projects"
            description={STATUS_DESCRIPTIONS.launched}
            count={launchedProjects.length}
            countLabel={launchedProjects.length === 1 ? "project" : "projects"}
            iconClassName="text-emerald-400"
            titleClassName="text-emerald-400"
            className="overflow-hidden"
            bodyClassName="border-t border-zinc-800/30"
          >
            <ProjectRows projects={launchedProjects} />
          </CollectionPanel>
        ) : (
          <EmptyState icon={Rocket} message="No launched projects yet." />
        )
      )}

      {activeTab === "archive" && (
        archivedProjects.length > 0 ? (
          <CollectionPanel
            icon={FolderKanban}
            title="Archived projects"
            description={STATUS_DESCRIPTIONS.archived}
            count={archivedProjects.length}
            countLabel={archivedProjects.length === 1 ? "project" : "projects"}
            iconClassName="text-zinc-500"
            titleClassName="text-zinc-300"
            className="overflow-hidden"
            bodyClassName="border-t border-zinc-800/30"
          >
            <ProjectRows projects={archivedProjects} />
          </CollectionPanel>
        ) : (
          <EmptyState icon={FolderKanban} message="No archived projects." />
        )
      )}
    </div>
  );
}

function ProjectRows({ projects }: { projects: DbProject[] }) {
  return (
    <div className="divide-y divide-zinc-800/30">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/admin/projects/${project.slug}`}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-4 py-3 transition-colors hover:bg-zinc-800/30"
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="type-body-sm font-medium text-zinc-100 group-hover:text-white">
                {project.title}
              </p>
              <KindTag kind={project.kind} />
            </div>
            {project.summary && (
              <p className="type-body-sm line-clamp-2 text-zinc-500">{project.summary}</p>
            )}
          </div>

          <div className="flex shrink-0 items-start gap-4 pt-1">
            <div className="text-right">
              <p className="type-body-sm text-zinc-400">{project.artifact_count} research</p>
              <p className="mt-1 type-body-sm text-zinc-600">Updated {formatShortDate(project.updated_at)}</p>
            </div>
            <ChevronRight size={14} className="mt-1 text-zinc-700 transition-colors group-hover:text-zinc-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
