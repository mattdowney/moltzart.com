import { notFound } from "next/navigation";
import {
  Archive,
  FileText,
  Hammer,
  Lightbulb,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import { fetchProductBySlug } from "@/lib/db";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { ContextRail } from "@/components/admin/context-rail";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { ProductResearchView } from "@/components/product-research-view";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import type { ProductStatus } from "@/lib/products";
import { formatShortDate } from "@/lib/date-format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_META: Record<ProductStatus, { label: string; icon: LucideIcon }> = {
  idea: { label: "Idea", icon: Lightbulb },
  researching: { label: "Researching", icon: Search },
  building: { label: "Building", icon: Hammer },
  launched: { label: "Launched", icon: Rocket },
  archived: { label: "Archived", icon: Archive },
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchProductBySlug(slug);
  if (!data) notFound();

  const { product, research } = data;
  const statusMeta = STATUS_META[product.status];
  const foundationSections = [
    { id: "overview", title: "Opportunity overview", content: product.summary },
    { id: "problem", title: "Problem worth solving", content: product.problem },
    { id: "audience", title: "Primary audience", content: product.audience },
  ].filter((section): section is { id: string; title: string; content: string } => Boolean(section.content));
  const railSections = [
    {
      id: "status",
      title: "Product Context",
      content: (
        <>
          <p className="type-body text-zinc-100">{statusMeta.label}</p>
          <p className="type-body-sm text-zinc-500">Updated {formatShortDate(product.updated_at)}</p>
        </>
      ),
    },
    {
      id: "research",
      title: "Attached Research",
      content: (
        <>
          <p className="type-body text-zinc-100">{research.length}</p>
          <p className="type-body-sm text-zinc-500">Linked research items supporting this product idea.</p>
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 space-y-6 lg:border-r lg:border-zinc-800/60 lg:pr-8">
      <AdminPageIntro
        title={product.title}
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: product.title },
        ]}
      />

      {foundationSections.length > 0 && (
        <Panel className="flex flex-col">
          <PanelHeader
            icon={FileText}
            title="Product foundation"
            count={foundationSections.length}
            countLabel={foundationSections.length === 1 ? "section" : "sections"}
          />

          <div className="divide-y divide-zinc-800/30">
            {foundationSections.map((section) => (
              <section key={section.id} className="px-4 py-4">
                <p className="type-body-sm font-medium text-zinc-200">{section.title}</p>
                <div className="mt-2">
                  <MarkdownRenderer content={section.content} className="doc-markdown-compact doc-markdown-subtle" />
                </div>
              </section>
            ))}
          </div>
        </Panel>
      )}

      <ProductResearchView research={research} />
      </div>

      <ContextRail sections={railSections} />
    </div>
  );
}
