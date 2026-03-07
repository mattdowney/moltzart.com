import { CodeToken } from "@/components/admin/code-token";
import { Panel, PanelHeader } from "@/components/admin/panel";
import {
  AnimatedFilledTabs,
  CountPreview,
  MotionPreview,
  OverflowPreview,
  RailSpecPreview,
} from "./navigation-demos";
import {
  COUNT_PATTERNS,
  MOTION_RULES,
  RAIL_SPECS,
  RULES,
  SPACING_RULES,
} from "./navigation-data";

const DO_DONT = [
  {
    label: "Do",
    detail: (
      <>
        Use tabs for stable peer sections like <CodeToken>Overview</CodeToken>, <CodeToken>Queue</CodeToken>, and{" "}
        <CodeToken>Settings</CodeToken>.
      </>
    ),
  },
  {
    label: "Don't",
    detail: "Do not use tabs for transient filters, sort orders, or one-off status toggles.",
  },
  {
    label: "Do",
    detail: "Let content animate as a hand-off under a stable tab rail rather than moving the tabs themselves.",
  },
  {
    label: "Don't",
    detail: "Do not stack a second full-width tab rail directly below the first unless the hierarchy is obvious.",
  },
] as const;

export default function NavigationPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Navigation Model</h2>
        <p className="mb-6 max-w-2xl type-body-sm text-zinc-500">
          Tabs are for sibling sections, not loose actions. The rail should stay calm while the content
          beneath it changes quickly and predictably.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="overflow-hidden">
            <PanelHeader title="Use Tabs For Sections" description="Each item should change the page model." />
            <div className="space-y-2 px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                Good: <CodeToken>Overview</CodeToken>, <CodeToken>Queue</CodeToken>, <CodeToken>Settings</CodeToken>.
              </p>
              <p className="type-body-sm text-zinc-500">
                Bad: <CodeToken>Newest</CodeToken>, <CodeToken>Popular</CodeToken>, <CodeToken>7d</CodeToken>.
              </p>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Keep Labels Short" description="One or two words is the target." />
            <div className="space-y-2 px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                Fixed tabs can hold up to five items only when the labels stay compact.
              </p>
              <p className="type-body-sm text-zinc-500">
                If the label needs a sentence, the structure is doing too much work.
              </p>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Motion Belongs Below" description="The rail anchors the experience." />
            <div className="space-y-2 px-4 py-4">
              <p className="type-body-sm text-zinc-500">
                The active indicator can shift, but the stronger motion should happen in the content panel.
              </p>
              <p className="type-body-sm text-zinc-500">
                Keep the hand-off under <CodeToken>200ms</CodeToken> and avoid crossfading dense views.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Supported Counts</h2>
        <p className="mb-6 type-body-sm text-zinc-500">
          The component needs to handle two, three, four, and five items cleanly. The constraint is not the
          primitive, it is the label length and the information architecture.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {COUNT_PATTERNS.map((pattern) => (
            <CountPreview key={pattern.title} {...pattern} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Sizing And Spacing</h2>
        <p className="mb-6 type-body-sm text-zinc-500">
          A navigation rail needs a physical spec, not just a semantic one. Height, inner padding, icon size,
          and rail breathing room should be fixed enough that the component feels engineered rather than improvised.
        </p>

        <div className="mx-auto max-w-4xl space-y-4">
          {RAIL_SPECS.map((spec) => (
            <RailSpecPreview key={spec.name} {...spec} />
          ))}
        </div>

        <div className="mx-auto mt-4 max-w-4xl rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Token</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Rule</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              {SPACING_RULES.map((rule) => (
                <tr key={rule.token} className="border-b border-zinc-800/30 last:border-0">
                  <td className="px-4 py-3">
                    <CodeToken>{rule.token}</CodeToken>
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-400">{rule.value}</td>
                  <td className="px-4 py-3 text-zinc-400">{rule.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Tab Variants</h2>
        <p className="mb-6 type-body-sm text-zinc-500">
          Use filled tabs for compact in-panel switching. Use line tabs when the rail is acting as a section
          header for larger content below.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Panel className="overflow-hidden">
            <PanelHeader title="Filled Tabs" description="Compact switching inside a contained surface." />
            <div className="p-4">
              <AnimatedFilledTabs />
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Variant Rules" description="Choose the rail based on hierarchy." />
            <div className="space-y-3 px-4 py-4">
              <div>
                <p className="type-body-sm font-medium text-zinc-200">Filled</p>
                <p className="type-body-sm text-zinc-500">Best for local switching inside a panel or card.</p>
              </div>
              <div>
                <p className="type-body-sm font-medium text-zinc-200">Line</p>
                <p className="type-body-sm text-zinc-500">
                  Best for page-level sibling sections with more visual breathing room.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/40 p-3">
                <p className="type-body-sm text-zinc-400">
                  Line tabs want more horizontal breathing room and a quieter surface behind them.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Motion Spec</h2>
        <p className="mb-6 type-body-sm text-zinc-500">
          The rail itself should move very little. The active state needs to feel immediate, and the content
          beneath it should perform the more noticeable hand-off. This keeps navigation feeling stable.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Panel className="overflow-hidden">
            <PanelHeader title="State Hand-Off" description="Indicator settles fast, content follows." />
            <div className="p-4">
              <MotionPreview />
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel className="overflow-hidden">
              <PanelHeader title="Motion Tokens" description="Use a small, repeatable timing set." />
              <div className="m-4 mt-0 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                      <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Layer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Timing</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Spec</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-zinc-300">
                    {MOTION_RULES.map((item) => (
                      <tr key={item.layer} className="border-b border-zinc-800/30 last:border-0">
                        <td className="px-4 py-3">
                          <CodeToken>{item.layer}</CodeToken>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-400">{item.timing}</td>
                        <td className="px-4 py-3 text-zinc-400">{item.spec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel className="overflow-hidden">
              <PanelHeader title="Behavior Notes" description="Navigation should read as orientation, not spectacle." />
              <div className="space-y-2 px-4 py-4">
                {MOTION_RULES.map((item) => (
                  <p key={`${item.layer}-note`} className="type-body-sm text-zinc-500">
                    <span className="text-zinc-200">{item.layer}:</span> {item.note}
                  </p>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Overflow Behavior</h2>
        <p className="mb-6 type-body-sm text-zinc-500">
          If you genuinely need more than five items, do not compress the rail into illegibility. Let it scroll,
          regroup the taxonomy, or step down to a different navigation pattern.
        </p>

        <Panel className="overflow-hidden">
          <PanelHeader title="Scrollable Rail" description="Fallback for dense but still peer-level sections." />
          <div className="space-y-4 p-4">
            <OverflowPreview />
            <p className="type-body-sm text-zinc-500">
              On mobile, horizontal overflow is acceptable. On desktop, first ask whether the user is looking at
              too many categories at once.
            </p>
          </div>
        </Panel>
      </section>

      <section>
        <h2 className="mb-2 type-body font-medium text-zinc-100">Rules</h2>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4">
            <ul className="space-y-2">
              {RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-2 type-body-sm text-zinc-400">
                  <span className="shrink-0 text-zinc-600">&bull;</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Direction</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Guidance</th>
                </tr>
              </thead>
              <tbody className="text-xs text-zinc-300">
                {DO_DONT.map((item, index) => (
                  <tr key={`${item.label}-${index}`} className="border-b border-zinc-800/30 last:border-0">
                    <td className="px-4 py-3 align-top">
                      <span className="text-2xs font-mono text-teal-400">{item.label}</span>
                    </td>
                    <td className="px-4 py-3">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
