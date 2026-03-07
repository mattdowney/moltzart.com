import { Calendar, CircleAlert, Zap } from "lucide-react";
import { CodeToken } from "@/components/admin/code-token";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/admin/status-dot";
import {
  LaneTag,
  PillarTag,
  SourceTag,
  DomainTag,
  KindTag,
  StatusTag,
} from "@/components/admin/tag-badge";

const statusDotVariants = ["urgent", "active", "blocked", "scheduled", "complete", "neutral"] as const;

export default function BadgesPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Variants */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Variants</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Three structural variants control border and background treatment. Colors are applied via <CodeToken>className</CodeToken>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge>default</Badge>
          <Badge variant="outline">outline</Badge>
          <Badge variant="status" className="bg-blue-400/10 text-blue-400 border-blue-400/20">status</Badge>
        </div>
        <div className="mt-4 rounded border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-800/50">
                <th className="text-left font-medium px-4 py-2.5">Variant</th>
                <th className="text-left font-medium px-4 py-2.5">Treatment</th>
                <th className="text-left font-medium px-4 py-2.5">Use for</th>
              </tr>
            </thead>
            <tbody className="text-sm text-zinc-300">
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2.5"><span className="text-2xs font-mono text-teal-400">default</span></td>
                <td className="px-4 py-2.5">Colored bg, no border</td>
                <td className="px-4 py-2.5">Category tags, labels</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2.5"><span className="text-2xs font-mono text-teal-400">outline</span></td>
                <td className="px-4 py-2.5">Border + subtle bg</td>
                <td className="px-4 py-2.5">Source labels, metadata pills</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="text-2xs font-mono text-teal-400">status</span></td>
                <td className="px-4 py-2.5">Border + colored bg (triad)</td>
                <td className="px-4 py-2.5">Counts, status indicators</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Shapes */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Shapes</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Default shape uses <CodeToken>rounded</CodeToken> (4px). Pill shape uses <CodeToken>rounded-full</CodeToken> for counts and compact pills.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge>rounded</Badge>
          <Badge shape="pill">pill</Badge>
          <Badge variant="outline">rounded</Badge>
          <Badge variant="outline" shape="pill">pill</Badge>
          <Badge variant="status" shape="pill" className="bg-amber-400/10 text-amber-400 border-amber-400/20">3</Badge>
          <Badge variant="status" shape="pill" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">12</Badge>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Sizes</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Use <CodeToken>size="compact"</CodeToken> when badges need to read as dense metadata rather than primary UI chrome.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" shape="pill">default</Badge>
          <Badge variant="outline" shape="pill" size="compact">compact</Badge>
          <Badge variant="status" shape="pill" size="compact" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
            active
          </Badge>
        </div>
      </section>

      {/* With icons */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">With Icons</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          SVGs inside <CodeToken>Badge</CodeToken> auto-size to <CodeToken>10px</CodeToken> via <CodeToken>[&gt;svg]:size-2.5</CodeToken>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline"><Calendar /> due Mar 10</Badge>
          <Badge variant="status" className="border-orange-400/20 bg-orange-400/10 text-orange-300"><CircleAlert /> blocked</Badge>
          <Badge className="bg-violet-500/20 text-violet-400"><Zap /> active</Badge>
        </div>
      </section>

      {/* Status colors */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Status Colors</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          The <CodeToken>status</CodeToken> variant expects a color triad: <CodeToken>bg-color/10 text-color border-color/20</CodeToken>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {([
            { label: "urgent", cls: "bg-red-400/10 text-red-400 border-red-400/20" },
            { label: "active", cls: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
            { label: "blocked", cls: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
            { label: "scheduled", cls: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
            { label: "complete", cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
            { label: "neutral", cls: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20" },
          ]).map((s) => (
            <Badge key={s.label} variant="status" className={s.cls}>{s.label}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-3">
          {([
            { label: "3", cls: "bg-red-400/10 text-red-400 border-red-400/20" },
            { label: "7", cls: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
            { label: "2", cls: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
            { label: "15", cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
          ]).map((s, i) => (
            <Badge key={i} variant="status" shape="pill" className={s.cls}>{s.label}</Badge>
          ))}
        </div>
      </section>

      {/* Domain wrappers */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Domain Wrappers</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Convenience components that compose on <CodeToken>Badge</CodeToken> with preset color maps. All accept a string prop and fall back to neutral zinc.
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">LaneTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["HN", "Design", "CSS", "AI/Tech", "UX"].map((l) => (
                <LaneTag key={l} lane={l} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">SourceTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["The Verge", "Hacker News", "TechCrunch", "Ars Technica"].map((s) => (
                <SourceTag key={s} source={s} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">PillarTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["DESIGN + DEVELOPMENT", "TECH + INNOVATION", "WORK + MINDSET"].map((p) => (
                <PillarTag key={p} pillar={p} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">DomainTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["product", "marketing", "ops", "content", "strategy"].map((d) => (
                <DomainTag key={d} domain={d} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">KindTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              <KindTag kind="product" />
              <KindTag kind="general" />
            </div>
          </div>

          <div>
            <p className="text-2xs font-mono text-teal-400 mb-2">StatusTag</p>
            <div className="flex items-center gap-2 flex-wrap">
              {(["idea", "researching", "building", "launched", "archived"] as const).map((s) => (
                <StatusTag key={s} status={s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* StatusDot */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">StatusDot</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          8px colored dot indicator. Not a badge — used inline next to text for status signaling.
        </p>
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
    </div>
  );
}
