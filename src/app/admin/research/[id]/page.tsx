import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DomainTag } from "@/components/admin/tag-badge";
import { fetchProjectById, fetchResearchArtifactById } from "@/lib/db";
import { ContextRail } from "@/components/admin/context-rail";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { extractHeadings } from "@/lib/research-headings";
import { ResearchToc } from "@/components/admin/research-toc";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { formatShortDate } from "@/lib/date-format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function getLinkItems(sourceLinks: unknown[] | null): Array<{ label: string; url: string }> {
  if (!sourceLinks) return [];

  const items: Array<{ label: string; url: string }> = [];
  for (const entry of sourceLinks) {
    if (typeof entry === "string") {
      items.push({ label: entry, url: entry });
      continue;
    }
    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const url = typeof obj.url === "string" ? obj.url : null;
    if (!url) continue;
    const label = typeof obj.label === "string" && obj.label.trim().length > 0 ? obj.label : url;
    items.push({ label, url });
  }

  return items;
}

export default async function AdminResearchDetailPage({ params }: Props) {
  const { id } = await params;
  const artifact = await fetchResearchArtifactById(id);
  if (!artifact) notFound();
  const linkedProject = artifact.project_id ? await fetchProjectById(artifact.project_id) : null;

  const sourceLinks = getLinkItems(artifact.source_links);
  const headings = extractHeadings(artifact.body_md);
  const railSections = [
    {
      id: "meta",
      title: "Context",
      content: (
        <>
          <p className="type-body-sm text-zinc-400">{formatShortDate(artifact.created_at)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <DomainTag domain={artifact.domain} />
            {linkedProject && (
              <a
                href={`/admin/projects/${linkedProject.project.slug}`}
                className="type-body-sm text-zinc-400 transition-colors hover:text-teal-400"
              >
                {linkedProject.project.title}
              </a>
            )}
          </div>
        </>
      ),
    },
    ...(sourceLinks.length > 0
      ? [{
          id: "sources",
          title: "Source Links",
          content: (
            <div className="space-y-2">
              {sourceLinks.map((item) => (
                <a
                  key={`${item.url}-${item.label}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/50 px-3 py-3 transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/60"
                >
                  <span className="type-body-sm text-zinc-300">{item.label}</span>
                  <ExternalLink size={12} className="mt-1 shrink-0 text-teal-400" />
                </a>
              ))}
            </div>
          ),
        }]
      : []),
    ...(headings.length > 0
      ? [{
          id: "toc",
          title: "On This Page",
          content: <ResearchToc headings={headings} />,
        }]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 lg:border-r lg:border-zinc-800/60 lg:pr-8">
        <AdminPageIntro
          title={artifact.title}
          breadcrumbs={[
            { label: "Research", href: "/admin/research" },
            ...(linkedProject
              ? [{ label: linkedProject.project.title, href: `/admin/projects/${linkedProject.project.slug}` }]
              : []),
            { label: artifact.title },
          ]}
        />

        <div className="mt-6">
          <MarkdownRenderer content={artifact.body_md} generateIds skipFirstH1 />
        </div>
      </div>

      <ContextRail sections={railSections} />
    </div>
  );
}
