import { AlertCircle, ArrowRight, Search } from "lucide-react";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { DomainTag } from "@/components/admin/tag-badge";
import { StatusDot } from "@/components/admin/status-dot";

const sampleTableData = [
  { name: "Research: AI Agents", domain: "product", date: "Mar 1", status: "active" as const },
  { name: "Newsletter Pipeline", domain: "ops", date: "Feb 28", status: "complete" as const },
  { name: "Landing Page Copy", domain: "marketing", date: "Feb 25", status: "scheduled" as const },
];

export default function CardsPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Hierarchy */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Container Hierarchy</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Three levels of containment. Never skip a level or nest containers of the same type.
        </p>
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Container</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Surface</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Role</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Rule</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">Panel</span></td>
                <td className="px-4 py-2 font-mono text-zinc-500">zinc-800/60</td>
                <td className="px-4 py-2">Section container — groups related content</td>
                <td className="px-4 py-2 text-zinc-500">1 per logical section, never nested</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">Card</span></td>
                <td className="px-4 py-2 font-mono text-zinc-500">zinc-900/30</td>
                <td className="px-4 py-2">Content item — a single entity or data group</td>
                <td className="px-4 py-2 text-zinc-500">Inside Panel or standalone, never wraps a Panel</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">Table</span></td>
                <td className="px-4 py-2 font-mono text-zinc-500">zinc-900/30</td>
                <td className="px-4 py-2">Structured data — rows and columns</td>
                <td className="px-4 py-2 text-zinc-500">Card-level surface, never inside a Card</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Panel */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Panel</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Elevated section container. Use <span className="text-2xs font-mono text-teal-400">PanelHeader</span> for
          icon + title + count + action link. Content goes below the header divider.
        </p>
        <div className="space-y-3">
          <Panel className="flex flex-col">
            <PanelHeader
              icon={AlertCircle}
              title="Action Queue"
              count={3}
              action={{ label: "View all", href: "#" }}
            />
            <div className="divide-y divide-zinc-800/30">
              {["Review draft batch", "Approve newsletter", "Check agent logs"].map((item) => (
                <div key={item} className="px-4 py-3 flex items-center justify-between group hover:bg-zinc-800/20 transition-colors">
                  <span className="type-body-sm text-zinc-300">{item}</span>
                  <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="flex flex-col">
            <PanelHeader icon={Search} title="Minimal" />
            <div className="px-4 py-3 type-body-sm text-zinc-400">Header with icon only, no count or action.</div>
          </Panel>
        </div>

        <div className="mt-4 space-y-1">
          <p className="type-body-sm text-zinc-400">When to use Panel:</p>
          <ul className="type-body-sm text-zinc-500 list-disc pl-4 space-y-0.5">
            <li>Dashboard sections (action queue, stats, highlights)</li>
            <li>Detail page content blocks (task detail, research content)</li>
            <li>Collapsible groups (task sections, research groups)</li>
          </ul>
          <p className="type-body-sm text-zinc-400 mt-2">When not to use Panel:</p>
          <ul className="type-body-sm text-zinc-500 list-disc pl-4 space-y-0.5">
            <li>Individual list items — use a Card or bare row</li>
            <li>Wrapping a single input or button — too heavy</li>
            <li>Inside another Panel — never nest</li>
          </ul>
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Card</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Content-level container. Interactive cards get a hover state; static cards do not.
          Add <span className="text-2xs font-mono text-teal-400">group</span> class for child hover effects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors px-4 py-3 cursor-pointer group">
            <div className="flex items-center justify-between">
              <p className="type-body-sm font-medium text-zinc-200">Interactive card</p>
              <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="type-body-sm text-zinc-500 mt-1">Hover state + group child effects</p>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3">
            <p className="type-body-sm font-medium text-zinc-200">Static card</p>
            <p className="type-body-sm text-zinc-500 mt-1">Display only, no interaction</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Type</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Classes</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Interactive</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">Static</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">rounded-lg border border-zinc-800/50 bg-zinc-900/30</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Table</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Same surface as a Card. Header row gets <span className="text-2xs font-mono text-teal-400">bg-zinc-900/60</span> and
          a stronger bottom border to anchor it above the body. Interactive rows get hover states.
        </p>

        <div className="space-y-6">
          {/* Interactive table */}
          <div>
            <p className="type-body-sm text-zinc-400 mb-2">Interactive rows</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                    <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2 w-6"></th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Name</th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Domain</th>
                    <th className="text-right text-xs font-medium text-zinc-500 px-4 py-2">Date</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sampleTableData.map((row) => (
                    <tr key={row.name} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                      <td className="px-4 py-2"><StatusDot variant={row.status} /></td>
                      <td className="text-left text-xs text-zinc-200 px-4 py-2">{row.name}</td>
                      <td className="text-left px-4 py-2"><DomainTag domain={row.domain} /></td>
                      <td className="text-right text-xs text-zinc-500 px-4 py-2 font-mono">{row.date}</td>
                      <td className="px-4 py-2">
                        <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Static table */}
          <div>
            <p className="type-body-sm text-zinc-400 mb-2">Static rows</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                    <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Name</th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Domain</th>
                    <th className="text-right text-xs font-medium text-zinc-500 px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleTableData.map((row) => (
                    <tr key={row.name} className="border-b border-zinc-800/30 last:border-0">
                      <td className="text-left text-xs text-zinc-300 px-4 py-2">{row.name}</td>
                      <td className="text-left px-4 py-2"><DomainTag domain={row.domain} /></td>
                      <td className="text-right text-xs text-zinc-500 px-4 py-2 font-mono">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column type reference */}
        <div className="mt-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Column Type</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Alignment</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Style</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Primary text</td>
                <td className="px-4 py-2">Left</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">text-xs text-zinc-200</span></td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Secondary text</td>
                <td className="px-4 py-2">Left</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">text-xs text-zinc-500</span></td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Dates / numbers</td>
                <td className="px-4 py-2">Right</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">text-xs text-zinc-500 font-mono text-right</span></td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Badges / tags</td>
                <td className="px-4 py-2">Left</td>
                <td className="px-4 py-2">Badge or TagBadge components</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Status indicator</td>
                <td className="px-4 py-2">Left</td>
                <td className="px-4 py-2">StatusDot in a narrow first column</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Action chevron</td>
                <td className="px-4 py-2">Right</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">ArrowRight size=12, group-hover:text-zinc-400</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dividers */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Dividers</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Two weights. Section dividers separate major blocks. Subtle dividers separate rows within a container.
        </p>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="type-body-sm text-zinc-300">Section divider</p>
              <span className="text-2xs font-mono text-teal-400">border-zinc-700/50</span>
            </div>
            <hr className="border-zinc-700/50" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="type-body-sm text-zinc-300">Subtle divider (rows)</p>
              <span className="text-2xs font-mono text-teal-400">border-zinc-800/30</span>
            </div>
            <hr className="border-zinc-800/30" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="type-body-sm text-zinc-300">Divide utility (stacked items)</p>
              <span className="text-2xs font-mono text-teal-400">divide-y divide-zinc-800/30</span>
            </div>
            <div className="divide-y divide-zinc-800/30 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <div className="px-4 py-3 type-body-sm text-zinc-300">First item</div>
              <div className="px-4 py-3 type-body-sm text-zinc-300">Second item</div>
              <div className="px-4 py-3 type-body-sm text-zinc-300">Third item</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Shadows</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Borders are the default depth cue. Shadows are reserved for floating layers only.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-20 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shadow-card" />
            <p className="type-body-sm text-zinc-300 mt-2">shadow-card</p>
            <p className="type-body-sm text-zinc-500">Popovers, tooltips</p>
          </div>
          <div>
            <div className="h-20 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shadow-overlay" />
            <p className="type-body-sm text-zinc-300 mt-2">shadow-overlay</p>
            <p className="type-body-sm text-zinc-500">Modals, sheets, dropdowns</p>
          </div>
        </div>
        <p className="type-body-sm text-zinc-500 mt-3">
          Never use shadows on static cards or Panels — only on elements that float above the page.
        </p>
      </section>

      {/* Rules */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="type-body-sm text-zinc-300 mb-2">Do</p>
            <ul className="type-body-sm text-zinc-500 list-disc pl-4 space-y-1">
              <li>One Panel per logical section</li>
              <li>Cards for individual items inside or alongside Panels</li>
              <li>Subtle dividers between rows inside a container</li>
              <li>Section dividers between major blocks on a page</li>
              <li>Borders for depth — shadows only for floating layers</li>
            </ul>
          </div>
          <div>
            <p className="type-body-sm text-zinc-300 mb-2">Don&apos;t</p>
            <ul className="type-body-sm text-zinc-500 list-disc pl-4 space-y-1">
              <li>Nest Panel inside Panel</li>
              <li>Wrap a Card around a Panel</li>
              <li>Use shadow-card or shadow-overlay on static elements</li>
              <li>Put a Table inside a Card — Table is its own card-level surface</li>
              <li>Use section dividers inside a container (use subtle)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
