"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileSearch, FolderOpen, Inbox, LibraryBig } from "lucide-react";
import type { DbProject, DbResearchArtifact } from "@/lib/db";
import { CollectionPanel } from "@/components/admin/collection-panel";
import { ContextRail } from "@/components/admin/context-rail";
import { EmptyState } from "@/components/admin/empty-state";
import { MetricStrip } from "@/components/admin/metric-strip";
import { SectionTabs } from "@/components/admin/section-tabs";
import { DomainTag } from "@/components/admin/tag-badge";
import { formatShortDate } from "@/lib/date-format";

type ResearchTab = "grouped" | "unassigned" | "recent";

interface ResearchLibraryViewProps {
  artifacts: DbResearchArtifact[];
  projects: DbProject[];
}

interface ArtifactGroup {
  projectId: string | null;
  title: string;
  artifacts: DbResearchArtifact[];
  description: string;
}

function buildGroups(
  artifacts: DbResearchArtifact[],
  projects: DbProject[],
): ArtifactGroup[] {
  const projectMap = new Map(projects.map((project) => [project.id, project]));
  const grouped = new Map<string | null, DbResearchArtifact[]>();

  for (const artifact of artifacts) {
    const key = artifact.project_id;
    const list = grouped.get(key);
    if (list) list.push(artifact);
    else grouped.set(key, [artifact]);
  }

  const groups: ArtifactGroup[] = [];

  for (const [projectId, items] of grouped) {
    if (projectId === null) {
      groups.push({
        projectId,
        title: "Unassigned intake",
        artifacts: items,
        description: "Loose findings that still need a project home or an explicit decision to archive them.",
      });
      continue;
    }

    const project = projectMap.get(projectId);
    groups.push({
      projectId,
      title: project?.title ?? "Unknown project",
      artifacts: items,
      description: project?.summary?.trim() || "Research already attached to active project context.",
    });
  }

  groups.sort((a, b) => {
    if (a.projectId === null) return 1;
    if (b.projectId === null) return -1;
    return (b.artifacts[0]?.updated_at ?? "").localeCompare(a.artifacts[0]?.updated_at ?? "");
  });

  return groups;
}

export function ResearchLibraryView({
  artifacts,
  projects,
}: ResearchLibraryViewProps) {
  const [activeTab, setActiveTab] = useState<ResearchTab>("grouped");

  const groupedArtifacts = useMemo(
    () => buildGroups(artifacts, projects),
    [artifacts, projects]
  );
  const unassignedArtifacts = useMemo(
    () => artifacts.filter((artifact) => artifact.project_id === null),
    [artifacts]
  );
  const recentArtifacts = useMemo(
    () => [...artifacts].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [artifacts]
  );

  const assignedCount = artifacts.length - unassignedArtifacts.length;

  const tabItems = [
    { id: "grouped", label: "By Project", count: groupedArtifacts.filter((group) => group.projectId !== null).length },
    { id: "unassigned", label: "Unassigned", count: unassignedArtifacts.length },
    { id: "recent", label: "Recent", count: recentArtifacts.length },
  ];

  const railSections = [
    {
      id: "inventory",
      title: "Library State",
      content: (
        <>
          <MetricStrip
            items={[
              { label: "Artifacts", value: artifacts.length },
              { label: "Attached", value: assignedCount, tone: "teal" },
              { label: "Loose", value: unassignedArtifacts.length, tone: unassignedArtifacts.length > 0 ? "amber" : "green" },
            ]}
            className="grid-cols-1"
          />
        </>
      ),
    },
    {
      id: "modes",
      title: "How To Read This",
      content: (
        <>
          <p className="type-body-sm text-zinc-400">
            <span className="text-zinc-200">By Project</span> is the working mode. It shows whether research is actually grounded in current work.
          </p>
          <p className="type-body-sm text-zinc-400">
            <span className="text-zinc-200">Unassigned</span> is the cleanup mode. It should stay small and intentional.
          </p>
          <p className="type-body-sm text-zinc-400">
            <span className="text-zinc-200">Recent</span> is the intake stream. Use it when you want to scan what entered the system most recently.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          {
            label: "Research Library",
            value: artifacts.length,
            note: "Every captured artifact in the system.",
          },
          {
            label: "Attached",
            value: assignedCount,
            tone: "teal",
            note: "Already linked into active project context.",
          },
          {
            label: "Unassigned",
            value: unassignedArtifacts.length,
            tone: unassignedArtifacts.length > 0 ? "amber" : "green",
            note: "Needs project linkage or an explicit archive decision.",
          },
        ]}
        className="xl:grid-cols-3"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <SectionTabs
            items={tabItems}
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ResearchTab)}
          />

          {activeTab === "grouped" && (
            groupedArtifacts.filter((group) => group.projectId !== null).length > 0 ? (
              <div className="space-y-4">
                {groupedArtifacts
                  .filter((group) => group.projectId !== null)
                  .map((group) => (
                    <CollectionPanel
                      key={group.projectId ?? "unassigned"}
                      icon={FolderOpen}
                      title={group.title}
                      description={group.description}
                      count={group.artifacts.length}
                      countLabel={group.artifacts.length === 1 ? "artifact" : "artifacts"}
                      iconClassName="text-teal-400"
                      className="overflow-hidden"
                      bodyClassName="border-t border-zinc-800/30"
                    >
                      <ArtifactRows artifacts={group.artifacts} />
                    </CollectionPanel>
                  ))}
              </div>
            ) : (
              <EmptyState icon={LibraryBig} message="No project-linked research yet." />
            )
          )}

          {activeTab === "unassigned" && (
            unassignedArtifacts.length > 0 ? (
              <CollectionPanel
                icon={Inbox}
                title="Unassigned intake"
                description="The artifacts here have entered the system but are still floating outside project context."
                count={unassignedArtifacts.length}
                countLabel={unassignedArtifacts.length === 1 ? "artifact" : "artifacts"}
                iconClassName="text-amber-400"
                className="overflow-hidden"
                bodyClassName="border-t border-zinc-800/30"
              >
                <ArtifactRows artifacts={unassignedArtifacts} />
              </CollectionPanel>
            ) : (
              <EmptyState icon={Inbox} message="Everything is already attached to a project." />
            )
          )}

          {activeTab === "recent" && (
            recentArtifacts.length > 0 ? (
              <CollectionPanel
                icon={FileSearch}
                title="Recent intake"
                description="A flat latest-first stream for checking what entered the library most recently."
                count={recentArtifacts.length}
                countLabel={recentArtifacts.length === 1 ? "artifact" : "artifacts"}
                iconClassName="text-zinc-400"
                className="overflow-hidden"
                bodyClassName="border-t border-zinc-800/30"
              >
                <ArtifactRows artifacts={recentArtifacts} />
              </CollectionPanel>
            ) : (
              <EmptyState icon={FileSearch} message="No research artifacts yet." />
            )
          )}
        </div>

        <ContextRail sections={railSections} />
      </div>
    </div>
  );
}

function ArtifactRows({ artifacts }: { artifacts: DbResearchArtifact[] }) {
  return (
    <div className="divide-y divide-zinc-800/30">
      {artifacts.map((artifact) => (
        <Link
          key={artifact.id}
          href={`/admin/research/${artifact.id}`}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-4 py-3 transition-colors hover:bg-zinc-800/30"
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="type-body-sm font-medium text-zinc-100 group-hover:text-white">
                {artifact.title}
              </p>
              <DomainTag domain={artifact.domain} />
            </div>
            {artifact.summary && (
              <p className="type-body-sm line-clamp-2 text-zinc-500">
                {artifact.summary}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-start gap-3 pt-1">
            <span className="type-body-sm text-zinc-600">{formatShortDate(artifact.created_at)}</span>
            <ChevronRight size={14} className="mt-1 text-zinc-700 transition-colors group-hover:text-zinc-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
