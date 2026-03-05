import { AlertCircle, Search } from "lucide-react";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { DomainTag } from "@/components/admin/tag-badge";

const borderPatterns = [
  { label: "Standard card", cls: "border border-zinc-800/50" },
  { label: "Panel component", cls: "border border-zinc-700/50" },
  { label: "Subtle divider", cls: "border border-zinc-800/30" },
  { label: "Input border", cls: "border border-zinc-800" },
];

const sampleTableData = [
  { name: "Research: AI Agents", domain: "product", date: "Mar 1, 2026" },
  { name: "Newsletter Pipeline", domain: "ops", date: "Feb 28, 2026" },
  { name: "Landing Page Copy", domain: "marketing", date: "Feb 25, 2026" },
];

export default function CardsPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Card types */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Card Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="type-body-sm text-zinc-400 mb-2">Interactive</p>
            <div className="border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors px-4 py-3 cursor-pointer">
              <p className="type-body-sm font-medium text-zinc-200">Interactive card</p>
              <p className="type-body-sm text-zinc-500 mt-1">Hover to see background change</p>
            </div>
          </div>
          <div>
            <p className="type-body-sm text-zinc-400 mb-2">Static</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3">
              <p className="type-body-sm font-medium text-zinc-200">Static card</p>
              <p className="type-body-sm text-zinc-500 mt-1">No hover state</p>
            </div>
          </div>
        </div>
      </section>

      {/* Panel */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Panel & PanelHeader</h2>
        <div className="space-y-3">
          <Panel className="flex flex-col">
            <PanelHeader
              icon={AlertCircle}
              title="With icon, count, and action"
              count={12}
              action={{ label: "View all", href: "#" }}
            />
            <div className="px-4 py-3 type-body-sm text-zinc-400">Panel content area</div>
          </Panel>

          <Panel className="flex flex-col">
            <PanelHeader title="Title only" />
            <div className="px-4 py-3 type-body-sm text-zinc-400">Minimal header</div>
          </Panel>

          <Panel className="flex flex-col">
            <PanelHeader icon={Search} title="Custom count label" count={3} countLabel="artifacts" />
            <div className="px-4 py-3 type-body-sm text-zinc-400">Custom count label</div>
          </Panel>
        </div>
      </section>

      {/* Borders */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Border Patterns</h2>
        <div className="grid grid-cols-2 gap-3">
          {borderPatterns.map((b) => (
            <div key={b.label}>
              <div className={`h-16 rounded-lg bg-zinc-900/30 ${b.cls}`} />
              <p className="type-body-sm text-zinc-300 mt-2">{b.label}</p>
              <p className="text-2xs font-mono text-zinc-500">{b.cls}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dividers */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Dividers</h2>
        <div className="space-y-6">
          <div>
            <p className="type-body-sm text-zinc-400 mb-3">Section divider</p>
            <hr className="border-zinc-700/50" />
            <p className="text-2xs font-mono text-zinc-500 mt-2">border-zinc-700/50</p>
          </div>
          <div>
            <p className="type-body-sm text-zinc-400 mb-3">Subtle divider (list rows)</p>
            <hr className="border-zinc-800/30" />
            <p className="text-2xs font-mono text-zinc-500 mt-2">border-zinc-800/30</p>
          </div>
          <div>
            <p className="type-body-sm text-zinc-400 mb-3">Divide utility (stacked items)</p>
            <div className="divide-y divide-zinc-700/50 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <div className="px-4 py-3 type-body-sm text-zinc-300">First item</div>
              <div className="px-4 py-3 type-body-sm text-zinc-300">Second item</div>
              <div className="px-4 py-3 type-body-sm text-zinc-300">Third item</div>
            </div>
            <p className="text-2xs font-mono text-zinc-500 mt-2">divide-y divide-zinc-700/50</p>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Shadows</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-20 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shadow-card" />
            <p className="type-body-sm text-zinc-300 mt-2">shadow-card</p>
            <p className="type-body-sm text-zinc-500">Elevated panels, popovers</p>
          </div>
          <div>
            <div className="h-20 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shadow-overlay" />
            <p className="type-body-sm text-zinc-300 mt-2">shadow-overlay</p>
            <p className="type-body-sm text-zinc-500">Modals, sheets, dropdowns</p>
          </div>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Table</h2>
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-800/50">
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Domain</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleTableData.map((row) => (
                <tr key={row.name} className="border-b border-zinc-800/30 last:border-0">
                  <td className="text-left text-sm text-zinc-300 px-4 py-3">{row.name}</td>
                  <td className="text-left px-4 py-3"><DomainTag domain={row.domain} /></td>
                  <td className="text-left text-sm text-zinc-500 px-4 py-3">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
