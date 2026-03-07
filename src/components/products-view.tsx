"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ChevronRight,
  Hammer,
  Lightbulb,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { DbProductIdea } from "@/lib/db";
import type { ProductStatus } from "@/lib/products";
import { CollectionPanel } from "@/components/admin/collection-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { MetricStrip } from "@/components/admin/metric-strip";
import { SectionTabs } from "@/components/admin/section-tabs";
import { formatShortDate } from "@/lib/date-format";

const STATUS_META: Record<ProductStatus, { label: string; tone: string; icon: LucideIcon }> = {
  idea: { label: "Ideas", tone: "text-zinc-300", icon: Lightbulb },
  researching: { label: "Researching", tone: "text-teal-400", icon: Search },
  building: { label: "Building", tone: "text-teal-400", icon: Hammer },
  launched: { label: "Launched", tone: "text-teal-400", icon: Rocket },
  archived: { label: "Archived", tone: "text-teal-400", icon: Archive },
};

const ACTIVE_STATUSES: ProductStatus[] = ["idea", "researching", "building"];

const STATUS_DESCRIPTIONS: Record<ProductStatus, string> = {
  idea: "Early opportunities that still need sharper framing.",
  researching: "Ideas being tested against user, market, or product evidence.",
  building: "Concepts with enough conviction to be shaped into something real.",
  launched: "Shipped references that set the bar for complete product thinking.",
  archived: "Dormant or retired ideas that should not clutter the active pipeline.",
};

type ProductsTab = "active" | "launched" | "archive";

export function ProductsView({ products }: { products: DbProductIdea[] }) {
  const [activeTab, setActiveTab] = useState<ProductsTab>("active");
  const activeProducts = useMemo(
    () => products.filter((product) => ACTIVE_STATUSES.includes(product.status)),
    [products]
  );
  const launchedProducts = useMemo(
    () => products.filter((product) => product.status === "launched"),
    [products]
  );
  const archivedProducts = useMemo(
    () => products.filter((product) => product.status === "archived"),
    [products]
  );

  if (products.length === 0) {
    return <EmptyState icon={Lightbulb} message="No product ideas yet." />;
  }

  const activeCount = products.filter((product) => product.status !== "archived").length;
  const launchedCount = products.filter((product) => product.status === "launched").length;
  const researchCount = products.reduce((sum, product) => sum + product.research_count, 0);

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { label: "Product Ideas", value: products.length, note: "All concepts in the system." },
          { label: "Active Pipeline", value: activeCount, tone: "teal", note: `${researchCount} linked research items are informing active ideas.` },
          { label: "Shipped References", value: launchedCount, tone: "green", note: "Useful benchmarks for what full product thinking looks like." },
        ]}
        className="xl:grid-cols-3"
      />

      <SectionTabs
        items={[
          { id: "active", label: "Active", count: activeProducts.length },
          { id: "launched", label: "Launched", count: launchedProducts.length },
          { id: "archive", label: "Archive", count: archivedProducts.length },
        ]}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProductsTab)}
      />

      {activeTab === "active" && (
        <div className="space-y-4">
          {ACTIVE_STATUSES.map((status) => {
            const items = products.filter((product) => product.status === status);
            if (items.length === 0) return null;
            const Icon = STATUS_META[status].icon;

            return (
              <CollectionPanel
                key={status}
                icon={Icon}
                title={STATUS_META[status].label}
                description={STATUS_DESCRIPTIONS[status]}
                count={items.length}
                countLabel={items.length === 1 ? "idea" : "ideas"}
                iconClassName={STATUS_META[status].tone}
                titleClassName={STATUS_META[status].tone}
                className="overflow-hidden"
                bodyClassName="border-t border-zinc-800/30"
              >
                <ProductRows products={items} />
              </CollectionPanel>
            );
          })}
        </div>
      )}

      {activeTab === "launched" && (
        launchedProducts.length > 0 ? (
          <CollectionPanel
            icon={Rocket}
            title="Launched ideas"
            description={STATUS_DESCRIPTIONS.launched}
            count={launchedProducts.length}
            countLabel={launchedProducts.length === 1 ? "idea" : "ideas"}
            iconClassName="text-emerald-400"
            titleClassName="text-emerald-400"
            className="overflow-hidden"
            bodyClassName="border-t border-zinc-800/30"
          >
            <ProductRows products={launchedProducts} />
          </CollectionPanel>
        ) : (
          <EmptyState icon={Rocket} message="No launched ideas yet." />
        )
      )}

      {activeTab === "archive" && (
        archivedProducts.length > 0 ? (
          <CollectionPanel
            icon={Archive}
            title="Archived ideas"
            description={STATUS_DESCRIPTIONS.archived}
            count={archivedProducts.length}
            countLabel={archivedProducts.length === 1 ? "idea" : "ideas"}
            iconClassName="text-zinc-500"
            titleClassName="text-zinc-300"
            className="overflow-hidden"
            bodyClassName="border-t border-zinc-800/30"
          >
            <ProductRows products={archivedProducts} />
          </CollectionPanel>
        ) : (
          <EmptyState icon={Archive} message="No archived ideas." />
        )
      )}
    </div>
  );
}

function ProductRows({ products }: { products: DbProductIdea[] }) {
  return (
    <div className="divide-y divide-zinc-800/30">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/admin/products/${product.slug}`}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-4 py-3 transition-colors hover:bg-zinc-800/30"
        >
          <div className="min-w-0 space-y-2">
            <p className="type-body-sm font-medium text-zinc-100 group-hover:text-white">
              {product.title}
            </p>
            {product.summary && (
              <p className="type-body-sm line-clamp-2 text-zinc-500">{product.summary}</p>
            )}
          </div>

          <div className="flex shrink-0 items-start gap-4 pt-1">
            <div className="text-right">
              <p className="type-body-sm text-zinc-400">{product.research_count} research</p>
              <p className="mt-1 type-body-sm text-zinc-600">Updated {formatShortDate(product.updated_at)}</p>
            </div>
            <ChevronRight size={14} className="mt-1 text-zinc-700 transition-colors group-hover:text-zinc-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
