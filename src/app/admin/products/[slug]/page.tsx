import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  FileText,
  Hammer,
  Lightbulb,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import { fetchProductBySlug } from "@/lib/db";
import { Panel } from "@/components/admin/panel";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { ProductResearchView } from "@/components/product-research-view";
import type { ProductStatus } from "@/lib/products";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
  const StatusIcon = statusMeta.icon;
  const foundationSections = [
    { id: "overview", title: "Opportunity overview", content: product.summary },
    { id: "problem", title: "Problem worth solving", content: product.problem },
    { id: "audience", title: "Primary audience", content: product.audience },
  ].filter((section): section is { id: string; title: string; content: string } => Boolean(section.content));

  return (
    <div className="space-y-4">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 type-body-sm text-zinc-500 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft size={12} />
        <span>Back to products</span>
      </Link>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusIcon size={14} className="text-teal-500" />
          <span className="type-badge text-zinc-500">{statusMeta.label}</span>
          <span className="type-badge text-zinc-600">Updated {formatDate(product.updated_at)}</span>
        </div>
        <h1 className="type-h2 text-zinc-100">{product.title}</h1>
      </header>

      {foundationSections.length > 0 && (
        <Panel className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-teal-500" />
              <span className="type-body-sm font-medium text-zinc-200">Product foundation</span>
            </div>
            <span className="type-body-sm text-zinc-600">
              {foundationSections.length} {foundationSections.length === 1 ? "section" : "sections"}
            </span>
          </div>

          <div className="divide-y divide-zinc-800/20">
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
  );
}
