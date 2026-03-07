import { AlertCircle, ArrowRight, Search, Sparkles } from "lucide-react";
import { CodeToken } from "@/components/admin/code-token";
import { AdminIconTile } from "@/components/admin/icon-tile";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { SummaryCard } from "@/components/admin/summary-card";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { DomainTag } from "@/components/admin/tag-badge";
import { StatusDot } from "@/components/admin/status-dot";
import { cn } from "@/lib/utils";

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
          One radius, two sanctioned surface depths. Hierarchy comes from layout and content treatment, not a new corner style.
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
                <td className="px-4 py-2 font-mono text-zinc-500">section · rounded-lg · zinc-900/45</td>
                <td className="px-4 py-2">Section container — groups related content</td>
                <td className="px-4 py-2 text-zinc-500">1 per logical section, never nested</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">Card</span></td>
                <td className="px-4 py-2 font-mono text-zinc-500">embedded · rounded-lg · zinc-950/40</td>
                <td className="px-4 py-2">Content item — a single entity or data group</td>
                <td className="px-4 py-2 text-zinc-500">Inside Panel or standalone, never wraps a Panel</td>
              </tr>
              <tr>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">Table</span></td>
                <td className="px-4 py-2 font-mono text-zinc-500">embedded · rounded-lg · zinc-950/40</td>
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
          Elevated section container. Use <CodeToken>PanelHeader</CodeToken> for
          the canonical admin card header: icon + title + meta/action with a single divider, no filled title bar.
          Content goes below the header divider.
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
          Content-level container. Interactive cards get a hover state; static cards do not. Summary cards use the same
          section surface as panels and differ through spacing, icon treatment, and copy weight, not a second corner radius.
        </p>
        <div className="mb-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Interior Rule</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Spec</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Why</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Base inset</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">px-4 py-4</span></td>
                <td className="px-4 py-2 text-zinc-500">Default for section cards, summary cards, and rail cards</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Primary gap</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">gap-3 / space-y-2</span></td>
                <td className="px-4 py-2 text-zinc-500">Keeps icon, title, and support copy tight but readable</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Title text</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">type-body + shared tight leading</span></td>
                <td className="px-4 py-2 text-zinc-500">Readable primary label without inflating card chrome</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Support text</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">type-body-sm + shared compact leading</span></td>
                <td className="px-4 py-2 text-zinc-500">Descriptions, meta, counts, actions, timestamps</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Icon block</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">rounded-md p-2.5 icon-16</span></td>
                <td className="px-4 py-2 text-zinc-500">Supportive marker, not the dominant visual anchor</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4">
          <p className="type-body-sm text-zinc-300 mb-3">Icon container usage</p>
          <div className="flex items-start gap-3">
            <AdminIconTile icon={Sparkles} />
            <div className="space-y-1">
              <p className="type-body font-medium text-zinc-200">Use one shared icon tile</p>
              <p className="type-body-sm text-zinc-500">
                Summary cards, resolved queue states, and similar admin callouts should reuse the same icon container.
                Do not invent a second icon box per component.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={cn(adminSurfaceVariants({ variant: "embedded" }), "cursor-pointer px-4 py-3 transition-colors hover:border-zinc-700/60 hover:bg-zinc-900/50 group")}>
            <div className="flex items-center justify-between">
              <p className="type-body font-medium text-zinc-200">Interactive card</p>
              <ArrowRight size={12} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="type-body-sm text-zinc-500 mt-1">Hover state + group child effects</p>
          </div>
          <div className={cn(adminSurfaceVariants({ variant: "embedded" }), "px-4 py-3")}>
            <p className="type-body font-medium text-zinc-200">Static card</p>
            <p className="type-body-sm text-zinc-500 mt-1">Display only, no interaction</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="type-body-sm text-zinc-400 mb-2">Summary card</p>
          <SummaryCard
            icon={Sparkles}
            title="Weekly snapshot"
            meta={<CodeToken>summary layer</CodeToken>}
            description="Contained summary surface for icon + title + meta + description. Use when a single content block needs more emphasis than a bare card, but should still feel embedded in the page."
          />
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
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">embedded surface + hover border/background shift</span></td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Static</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">embedded surface</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">Summary</td>
                <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">section surface + px-4 py-4 + compact icon block</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Table</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Same surface as a Card. Header row gets <CodeToken>bg-zinc-900/60</CodeToken> and
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
                <td className="px-4 py-2"><CodeToken>Badge</CodeToken> or <CodeToken>TagBadge</CodeToken> components</td>
              </tr>
              <tr className="border-b border-zinc-800/30">
                <td className="px-4 py-2">Status indicator</td>
                <td className="px-4 py-2">Left</td>
                <td className="px-4 py-2"><CodeToken>StatusDot</CodeToken> in a narrow first column</td>
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
