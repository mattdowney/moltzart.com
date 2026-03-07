import { CodeToken } from "@/components/admin/code-token";
import { PanelHeader } from "@/components/admin/panel";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const spacingScale = [
  {
    token: "1",
    utility: "gap-1 / space-y-1 / p-1",
    value: "4px",
    vertical: "Micro separation inside dense metadata or icon pairs",
    horizontal: "Tight inline gap between related affordances",
  },
  {
    token: "2",
    utility: "gap-2 / space-y-2 / p-2",
    value: "8px",
    vertical: "Default row rhythm for compact lists",
    horizontal: "Icon + label, badge groups, chip wraps",
  },
  {
    token: "3",
    utility: "gap-3 / space-y-3 / p-3",
    value: "12px",
    vertical: "Default card stack rhythm",
    horizontal: "Default control gap inside toolbars and split rows",
  },
  {
    token: "4",
    utility: "gap-4 / space-y-4 / p-4",
    value: "16px",
    vertical: "Room around a content block",
    horizontal: "Primary gutter between peer groups or columns",
  },
  {
    token: "5",
    utility: "gap-5 / space-y-5 / p-5",
    value: "20px",
    vertical: "Expanded stack without becoming sectional",
    horizontal: "Secondary layout gutter when 16 feels cramped",
  },
  {
    token: "6",
    utility: "gap-6 / space-y-6 / p-6",
    value: "24px",
    vertical: "Section rhythm inside a page",
    horizontal: "Wide gutter between large panels",
  },
  {
    token: "8",
    utility: "gap-8 / space-y-8 / p-8",
    value: "32px",
    vertical: "Major section break",
    horizontal: "Page-level gutter or spacious split layout",
  },
  {
    token: "12",
    utility: "gap-12 / space-y-12 / p-12",
    value: "48px",
    vertical: "Hero or dense-page reset",
    horizontal: "Large canvas margin, rarely inside app surfaces",
  },
  {
    token: "16",
    utility: "gap-16 / space-y-16 / p-16",
    value: "64px",
    vertical: "Top-level page rhythm only",
    horizontal: "Outer page framing, never row-level UI",
  },
];

const verticalPatterns = [
  {
    title: "Compact metadata",
    gap: "space-y-2",
    rhythm: "8px rhythm",
    note: "Use for labels, timestamps, and dense supporting content.",
    lines: [
      { label: "Updated 2h ago", width: "46%" },
      { label: "Owner: Matt", width: "34%" },
      { label: "3 pending items", width: "40%" },
    ],
  },
  {
    title: "Default content stack",
    gap: "space-y-3",
    rhythm: "12px rhythm",
    note: "The baseline stack for cards, forms, and list modules.",
    lines: [
      { label: "Section title", width: "58%" },
      { label: "Supporting description line", width: "76%" },
      { label: "Secondary metadata", width: "42%" },
    ],
  },
  {
    title: "Section rhythm",
    gap: "space-y-6",
    rhythm: "24px rhythm",
    note: "Use between distinct content groups, not between every row.",
    lines: [
      { label: "Overview", width: "70%" },
      { label: "Activity", width: "54%" },
      { label: "Notes", width: "62%" },
    ],
  },
];

const horizontalPatterns = [
  {
    title: "Toolbar grouping",
    note: "Keep related controls at 8-12px. Separate control groups at 16px.",
    rules: [
      <>Within a group: <CodeToken>gap-2</CodeToken> or <CodeToken>gap-3</CodeToken></>,
      <>Between groups: <CodeToken>gap-4</CodeToken></>,
      <>Use wrapping rows instead of inventing narrower gutters</>,
    ],
  },
  {
    title: "Content row layout",
    note: "Use one strong left cluster and one right cluster. Avoid sprinkling one-off margins.",
    rules: [
      <>Primary cluster: status + title + metadata</>,
      <>Secondary cluster: date, count, chevron</>,
      <>Let <CodeToken>justify-between</CodeToken> handle the long span, not extra padding</>,
    ],
  },
];

const insetPatterns = [
  {
    surface: "Toolbar row",
    inset: "px-4 py-3",
    density: "Default",
    use: "Navigation bars, filters, grouped controls",
  },
  {
    surface: "Interactive list row",
    inset: "px-4 py-3",
    density: "Default",
    use: "Tasks, article rows, action lists",
  },
  {
    surface: "Compact table header",
    inset: "px-4 py-2",
    density: "Compact",
    use: "Data tables where scanning matters more than touch comfort",
  },
  {
    surface: "Panel body section",
    inset: "px-4 py-4",
    density: "Roomy",
    use: "Detail page sections and grouped content",
  },
  {
    surface: "Page section gap",
    inset: "space-y-6",
    density: "Structural",
    use: "Top-level content groups inside a page",
  },
];

const spacingRules = [
  {
    name: <>Use <CodeToken>gap</CodeToken> and <CodeToken>space-y</CodeToken> for sibling rhythm</>,
    detail: <>Margins are for layout edges. Internal spacing should live on the parent so the rhythm is visible and consistent.</>,
  },
  {
    name: <>Treat vertical and horizontal spacing separately</>,
    detail: <>A stack can be roomy vertically and still use tight horizontal grouping. Do not force one scale choice to solve both axes.</>,
  },
  {
    name: <>Reserve the largest steps for structure</>,
    detail: <><CodeToken>8</CodeToken>, <CodeToken>12</CodeToken>, and <CodeToken>16</CodeToken> are page-level moves. If they show up inside a row, the component is doing too much.</>,
  },
  {
    name: <>Use insets to communicate density</>,
    detail: <>Padding is not decoration. <CodeToken>py-2</CodeToken> reads compact, <CodeToken>py-3</CodeToken> reads default, and <CodeToken>py-4</CodeToken> reads deliberate and slower.</>,
  },
];

export default function SpacingPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Page Headers</h2>
        <p className="type-body-sm text-zinc-500 mb-6 max-w-2xl">
          The <CodeToken>AdminPageIntro</CodeToken> component handles page titles, subtitles, breadcrumbs, meta, and actions.
          Each variant below is rendered live inside a bordered preview container.
        </p>

        <div className="space-y-6">
          {/* Title only */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">Title only</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro title="Dashboard" />
            </div>
            <p className="mt-2 text-2xs font-mono text-zinc-500">divider=&quot;default&quot; · pb-4 below title · border-zinc-800</p>
          </div>

          {/* Title + subtitle */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">Title + subtitle</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro
                title="Research"
                subtitle="Treat research as a working library. Project-bound artifacts should feel grounded."
              />
            </div>
          </div>

          {/* Title + subtitle + meta */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">Title + subtitle + meta</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro
                title="Tasks"
                subtitle="Move work across the board without losing sight of what is blocked."
                meta={<span className="type-body-sm text-zinc-500">42 tasks on the board</span>}
              />
            </div>
          </div>

          {/* Title + subtitle + meta + actions */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">Title + subtitle + meta + actions</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro
                title="Tasks"
                subtitle="Move work across the board without losing sight of what is blocked."
                meta={<span className="type-body-sm text-zinc-500">42 tasks on the board</span>}
                actions={
                  <Button type="button" variant="ghost" size="icon-sm" title="Refresh">
                    <RefreshCw size={14} />
                  </Button>
                }
              />
            </div>
          </div>

          {/* With breadcrumbs */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">With breadcrumbs</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro
                title="Newsletter Pipeline"
                subtitle="Keep the product foundation readable as one narrative."
                breadcrumbs={[
                  { label: "Products", href: "#" },
                  { label: "Newsletter Pipeline" },
                ]}
              />
            </div>
          </div>

          {/* Divider = none */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">divider=&quot;none&quot;</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro title="Styleguide" subtitle="Design system reference" divider="none" />
            </div>
          </div>

          {/* Divider = soft */}
          <div>
            <p className="type-body-sm font-medium text-zinc-200 mb-2">divider=&quot;soft&quot;</p>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-6">
              <AdminPageIntro title="Calendar" subtitle="Agent accountability view" divider="soft" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Spacing Model</h2>
        <p className="type-body-sm text-zinc-500 mb-6 max-w-2xl">
          UI spacing is not just a vertical ladder. It has three jobs: establish reading rhythm,
          create horizontal grouping, and set density through padding. App code should stay on the
          enforced 4px grid and use larger steps only when the layout actually changes level.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <PanelHeader
              title="Vertical Rhythm"
              description="Control reading flow with stack spacing."
            />
            <div className="px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                Use <span className="text-2xs font-mono text-teal-400">space-y-2</span>,
                <span className="text-2xs font-mono text-teal-400"> space-y-3</span>, and
                <span className="text-2xs font-mono text-teal-400"> space-y-6</span> as the main rhythm anchors.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <PanelHeader
              title="Horizontal Grouping"
              description="Separate related controls from unrelated groups."
            />
            <div className="px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                Inside a row, use tighter gaps for affinity and wider gutters between clusters. This
                is what makes tool UIs scan cleanly.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <PanelHeader
              title="Insets And Density"
              description="Padding tells the user how heavy a surface is."
            />
            <div className="px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                Compact rows feel operational. Roomier sections feel reflective. Use padding to set
                the mode, not just to fill space.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Core Scale</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          The app spacing scale is a strict 4px grid. Fractional steps and off-scale spacing are
          noise in UI work because they make alignment harder to maintain across rows, tables, and forms.
        </p>

        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Step</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Utility</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Value</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Vertical</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Horizontal</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              {spacingScale.map((step) => (
                <tr key={step.token} className="border-b border-zinc-800/30 last:border-0">
                  <td className="px-4 py-2">
                    <span className="text-2xs font-mono text-teal-400">{step.token}</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500 font-mono">{step.utility}</td>
                  <td className="px-4 py-2 font-mono text-zinc-400">{step.value}</td>
                  <td className="px-4 py-2">{step.vertical}</td>
                  <td className="px-4 py-2">{step.horizontal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Vertical Rhythm</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          Pick the rhythm based on the content’s semantic grouping, not on what looks balanced in isolation.
          Rows use compact steps. Modules use default steps. Sections use wide steps.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {verticalPatterns.map((pattern) => (
            <div key={pattern.title} className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <PanelHeader
                title={pattern.title}
                description={pattern.note}
                meta={pattern.gap}
                metaClassName="text-2xs font-mono text-teal-400"
              />

              <div className={`p-4 ${pattern.gap}`}>
                {pattern.lines.map((line) => (
                  <div key={line.label}>
                    <p className="text-2xs font-mono text-zinc-600 mb-1">{line.label}</p>
                    <div className="h-2 rounded-full bg-zinc-800" style={{ width: line.width }} />
                  </div>
                ))}
              </div>

              <p className="text-2xs font-mono text-zinc-500 mt-3">{pattern.rhythm}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Horizontal Layout</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          Horizontal spacing should reveal relationships. Tight gaps mean “these belong together.”
          Wide gaps mean “this is a separate group.” That distinction matters more in app UIs than on marketing pages.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <PanelHeader
              title={horizontalPatterns[0].title}
              description={horizontalPatterns[0].note}
              meta={<span className="text-2xs font-mono text-teal-400">gap-2 / gap-3 / gap-4</span>}
            />
            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap rounded-md border border-zinc-800/50 bg-zinc-950/40 px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-300">Status</div>
                    <div className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-300">Owner</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-300">Sort</div>
                    <div className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-300">View</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-zinc-100 px-3 py-2 type-body-sm text-zinc-950">New task</div>
                  <div className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-300">Export</div>
                </div>
              </div>

              <ul className="type-body-sm text-zinc-400 list-disc pl-4 space-y-0.5 mt-4">
                {horizontalPatterns[0].rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <PanelHeader
              title={horizontalPatterns[1].title}
              description={horizontalPatterns[1].note}
              meta={<span className="text-2xs font-mono text-teal-400">left cluster / right cluster</span>}
            />
            <div className="px-4 py-4">
              <div className="rounded-md border border-zinc-800/50 bg-zinc-950/40 overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-zinc-800/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-block size-2 rounded-full bg-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="type-body-sm text-zinc-200 truncate">Newsletter Pipeline</p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="text-2xs font-mono text-zinc-500">ops</span>
                        <span className="text-zinc-700">/</span>
                        <span className="text-2xs font-mono text-zinc-500">scheduled</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xs font-mono text-zinc-500">Mar 05</span>
                    <span className="text-zinc-700">12</span>
                    <span className="text-zinc-500">→</span>
                  </div>
                </div>
                <div className="px-4 py-3 type-body-sm text-zinc-500">
                  Keep the data row readable by preserving one left cluster and one right cluster.
                </div>
              </div>

              <ul className="type-body-sm text-zinc-400 list-disc pl-4 space-y-0.5 mt-4">
                {horizontalPatterns[1].rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Insets And Density</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Padding is part of the spacing system. Use it intentionally to signal whether a surface is compact,
          default, or spacious.
        </p>

        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Surface</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Inset</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Density</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-2">Use</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              {insetPatterns.map((pattern) => (
                <tr key={pattern.surface} className="border-b border-zinc-800/30 last:border-0">
                  <td className="px-4 py-2">{pattern.surface}</td>
                  <td className="px-4 py-2 font-mono text-teal-400">{pattern.inset}</td>
                  <td className="px-4 py-2 text-zinc-500">{pattern.density}</td>
                  <td className="px-4 py-2">{pattern.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Rules</h2>
        <p className="type-body-sm text-zinc-500 mb-4">
          Good spacing systems reduce decision count. These are the defaults the rest of the admin UI should converge on.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {spacingRules.map((rule, index) => (
            <div key={index} className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4">
              <p className="type-body-sm font-medium text-zinc-200 mb-1">{rule.name}</p>
              <p className="type-body-sm text-zinc-500">{rule.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
