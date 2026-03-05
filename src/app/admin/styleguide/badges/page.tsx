import { StatusDot } from "@/components/admin/status-dot";
import {
  LaneTag,
  PillarTag,
  SourceTag,
  DomainTag,
  KindTag,
} from "@/components/admin/tag-badge";

const statusDotVariants = ["urgent", "active", "blocked", "scheduled", "complete", "neutral"] as const;

export default function BadgesPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* StatusDot */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">StatusDot</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            {statusDotVariants.map((v) => (
              <div key={v} className="flex items-center gap-2">
                <StatusDot variant={v} />
                <span className="type-body-sm text-zinc-400">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            {statusDotVariants.map((v) => (
              <div key={`${v}-pulse`} className="flex items-center gap-2">
                <StatusDot variant={v} pulse />
                <span className="type-body-sm text-zinc-400">{v} (pulse)</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LaneTag */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">LaneTag</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {["HN", "Design", "CSS", "AI/Tech", "UX"].map((l) => (
            <LaneTag key={l} lane={l} />
          ))}
        </div>
      </section>

      {/* PillarTag */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">PillarTag</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {["DESIGN + DEVELOPMENT", "TECH + INNOVATION", "WORK + MINDSET"].map((p) => (
            <PillarTag key={p} pillar={p} />
          ))}
        </div>
      </section>

      {/* SourceTag */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">SourceTag</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {["The Verge", "Hacker News", "TechCrunch", "Ars Technica"].map((s) => (
            <SourceTag key={s} source={s} />
          ))}
        </div>
      </section>

      {/* DomainTag */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">DomainTag</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {["product", "marketing", "ops", "content", "strategy"].map((d) => (
            <DomainTag key={d} domain={d} />
          ))}
        </div>
      </section>

      {/* KindTag */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">KindTag</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <KindTag kind="product" />
          <KindTag kind="general" />
        </div>
      </section>
    </div>
  );
}
