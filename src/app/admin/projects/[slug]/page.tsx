import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FileSearch, FolderKanban, Lightbulb } from "lucide-react";
import { fetchProjectBySlug } from "@/lib/db";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { ContextRail } from "@/components/admin/context-rail";
import { EmptyState } from "@/components/admin/empty-state";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { ProductResearchView } from "@/components/product-research-view";
import { DomainTag, StatusTag, KindTag } from "@/components/admin/tag-badge";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { formatShortDate } from "@/lib/date-format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchProjectBySlug(slug);
  if (!data) notFound();

  const { project, linkedProduct, productResearch, artifacts } = data;
  const hasProjectOverview = Boolean(project.summary?.trim());
  const railSections = [
    {
      id: "status",
      title: "Project Context",
      content: (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <StatusTag status={project.status} />
            <KindTag kind={project.kind} />
          </div>
          <p className="type-body-sm text-zinc-400">Updated {formatShortDate(project.updated_at)}</p>
          {linkedProduct && (
            <Link
              href={`/admin/products/${linkedProduct.slug}`}
              className="type-body-sm text-zinc-400 transition-colors hover:text-teal-400"
            >
              Product: {linkedProduct.title}
            </Link>
          )}
        </>
      ),
    },
    {
      id: "inventory",
      title: "Attached Research",
      content: (
        <>
          <p className="type-body text-zinc-100">{artifacts.length}</p>
          <p className="type-body-sm text-zinc-500">Artifacts tied directly to this project.</p>
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 space-y-6 lg:border-r lg:border-zinc-800/60 lg:pr-8">
      <AdminPageIntro
        title={project.title}
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: project.title },
        ]}
      />

      {hasProjectOverview && (
        <Panel className="px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderKanban size={14} className="text-teal-400" />
            <span className="type-body-sm font-medium text-zinc-200">Project overview</span>
          </div>
          <MarkdownRenderer content={project.summary || ""} className="doc-markdown-compact doc-markdown-subtle" />
        </Panel>
      )}

      <Panel className="flex flex-col">
        <PanelHeader
          icon={FileSearch}
          title="Research artifacts"
          count={artifacts.length}
          countLabel="artifacts"
        />

        {artifacts.length === 0 ? (
          <div className="px-4 py-8">
            <EmptyState icon={FileSearch} message="No research artifacts attached to this project." />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/30">
            {artifacts.map((artifact) => (
              <Link
                key={artifact.id}
                href={`/admin/research/${artifact.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="type-body-sm font-medium text-zinc-200 group-hover:text-zinc-100 truncate">
                      {artifact.title}
                    </p>
                    <DomainTag domain={artifact.domain} />
                  </div>
                  {artifact.summary && (
                    <p className="type-body-sm text-zinc-500 mt-1 line-clamp-1">{artifact.summary}</p>
                  )}
                </div>
                <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Panel>

      {linkedProduct && (
        <Panel className="flex flex-col">
          <PanelHeader
            icon={Lightbulb}
            title="Product details"
            action={{ label: "Open product", href: `/admin/products/${linkedProduct.slug}` }}
          />

          <div className="divide-y divide-zinc-800/30">
            {linkedProduct.summary && (
              <section className="px-4 py-4">
                <p className="type-body-sm font-medium text-zinc-200">Opportunity overview</p>
                <div className="mt-2">
                  <MarkdownRenderer content={linkedProduct.summary} className="doc-markdown-compact doc-markdown-subtle" />
                </div>
              </section>
            )}
            {linkedProduct.problem && (
              <section className="px-4 py-4">
                <p className="type-body-sm font-medium text-zinc-200">Problem worth solving</p>
                <div className="mt-2">
                  <MarkdownRenderer content={linkedProduct.problem} className="doc-markdown-compact doc-markdown-subtle" />
                </div>
              </section>
            )}
            {linkedProduct.audience && (
              <section className="px-4 py-4">
                <p className="type-body-sm font-medium text-zinc-200">Primary audience</p>
                <div className="mt-2">
                  <MarkdownRenderer content={linkedProduct.audience} className="doc-markdown-compact doc-markdown-subtle" />
                </div>
              </section>
            )}
          </div>
        </Panel>
      )}

      {productResearch.length > 0 && <ProductResearchView research={productResearch} />}
      </div>

      <ContextRail sections={railSections} />
    </div>
  );
}
