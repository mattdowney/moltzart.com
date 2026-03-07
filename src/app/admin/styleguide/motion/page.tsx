"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { CodeToken } from "@/components/admin/code-token";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { Button } from "@/components/ui/button";

const DURATION_SCALE = [
  { label: "100ms", token: "duration-100", use: "Micro response" },
  { label: "150ms", token: "duration-150", use: "Buttons and hover" },
  { label: "200ms", token: "duration-200", use: "Default UI motion" },
  { label: "300ms", token: "duration-300", use: "Maximum allowed" },
] as const;

const EASING_LANES = [
  {
    title: "Enter",
    token: "ease-out",
    curve: [0.16, 1, 0.3, 1] as const,
    note: "Starts fast, settles gently.",
  },
  {
    title: "Exit",
    token: "ease-in",
    curve: [0.7, 0, 0.84, 0] as const,
    note: "Begins visibly, accelerates away.",
  },
  {
    title: "Loop",
    token: "ease-in-out",
    curve: [0.45, 0.05, 0.55, 0.95] as const,
    note: "Use only for balanced motion.",
  },
] as const;

const SWAP_STATES = [
  {
    id: "overview",
    title: "Overview",
    body: "Four active jobs, one blocked task, and two surfaces waiting for review.",
    meta: "summary mode",
  },
  {
    id: "activity",
    title: "Activity",
    body: "Three completions landed in the last hour. One new task entered backlog from research ingest.",
    meta: "live feed mode",
  },
] as const;

const STAGGER_ITEMS = [
  "Sync article batch",
  "Swap weekly filter",
  "Render updated cards",
  "Restore interaction state",
] as const;

const CORE_RULES = [
  <>Keep UI motion at <CodeToken>300ms</CodeToken> or less. Default to <CodeToken>150ms</CodeToken> to <CodeToken>200ms</CodeToken>.</>,
  <>Use <CodeToken>transform</CodeToken> and <CodeToken>opacity</CodeToken>. Do not animate layout properties.</>,
  <>Use <CodeToken>ease-out</CodeToken> for enters and <CodeToken>ease-in</CodeToken> for exits.</>,
  <>Never animate from <CodeToken>scale(0)</CodeToken>. Start pop-ins at <CodeToken>0.95</CodeToken> or higher.</>,
] as const;

const SURFACE_RULES = [
  <>Buttons already use <CodeToken>active:scale-[0.98]</CodeToken>. Reuse that instead of inventing a second press language.</>,
  <>Overlays use <CodeToken>backdrop-blur-md</CodeToken> with a translucent black scrim.</>,
  <>Use origin-aware scale for menus, popovers, and dropdown surfaces.</>,
  <>When dense content changes, use a sequential hand-off instead of a crossfade.</>,
] as const;

const SPRING = {
  menu: { type: "spring" as const, stiffness: 420, damping: 32 },
  settle: { type: "spring" as const, stiffness: 340, damping: 30 },
};

function DemoHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-800/50 bg-zinc-950/40 px-3 py-2">
      <p className="type-body-sm text-zinc-400">{children}</p>
    </div>
  );
}

export default function MotionPage() {
  const [durationIndex, setDurationIndex] = useState(1);
  const [durationReplayKey, setDurationReplayKey] = useState(0);
  const [easingReplayKey, setEasingReplayKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(true);
  const [swapIndex, setSwapIndex] = useState(0);
  const [staggerReplayKey, setStaggerReplayKey] = useState(0);

  const duration = DURATION_SCALE[durationIndex];

  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Motion Model</h2>
        <p className="type-body-sm text-zinc-500 mb-6 max-w-2xl">
          Motion should make the interface easier to read. It should confirm action, preserve
          orientation, and hand content from one state to the next without visual mud.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="overflow-hidden">
            <PanelHeader title="Fast By Default" description="The UI should feel immediate." />
            <div className="px-4 py-4 space-y-2">
              <p className="type-body-sm text-zinc-500">
                Most interactions belong at <CodeToken>150ms</CodeToken> or <CodeToken>200ms</CodeToken>.
              </p>
              <p className="type-body-sm text-zinc-500">
                <CodeToken>300ms</CodeToken> is a hard ceiling, not a comfort zone.
              </p>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Directional Motion" description="Enter and exit should not feel the same." />
            <div className="px-4 py-4 space-y-2">
              <p className="type-body-sm text-zinc-500">
                Enter with <CodeToken>ease-out</CodeToken>. Exit with <CodeToken>ease-in</CodeToken>.
              </p>
              <p className="type-body-sm text-zinc-500">
                Reserve <CodeToken>ease-in-out</CodeToken> for loops or balanced motion.
              </p>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="State Hand-Off" description="Swap one state out, then bring the next one in." />
            <div className="px-4 py-4 space-y-2">
              <p className="type-body-sm text-zinc-500">
                Menus should feel attached to their trigger.
              </p>
              <p className="type-body-sm text-zinc-500">
                Dense content should use sequential fades instead of crossfades.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Duration Scale</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          Pick a timing token, then replay the same transition. You should feel the interaction
          settle quickly without looking abrupt.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[18rem_1fr]">
          <Panel className="overflow-hidden">
            <PanelHeader title="Timing Tokens" description="Choose one speed for the same move." />
            <div className="p-4 space-y-2">
              {DURATION_SCALE.map((item, index) => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => {
                    setDurationIndex(index);
                    setDurationReplayKey((current) => current + 1);
                  }}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    index === durationIndex
                      ? "border-teal-400/30 bg-teal-400/10"
                      : "border-zinc-800/50 bg-zinc-950/40 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="type-body-sm font-medium text-zinc-200">{item.label}</span>
                    <CodeToken>{item.token}</CodeToken>
                  </div>
                  <p className="type-body-sm text-zinc-500 mt-1">{item.use}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader
              title="Preview"
              description="Filtered results enter from the left."
              meta={<CodeToken>{duration.label}</CodeToken>}
            />
            <div className="p-4 space-y-4">
              <div className="rounded-md border border-zinc-800/50 bg-zinc-950/50 p-4 min-h-32">
                <div className="h-24 overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-900/40 px-4 flex items-center">
                  <motion.div
                    key={`${duration.token}-${durationReplayKey}`}
                    initial={{ opacity: 0, x: -24, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: Number(duration.label.replace("ms", "")) / 1000, ease: [0.16, 1, 0.3, 1] }}
                    className="w-52 rounded-md border border-zinc-700/60 bg-zinc-900 px-4 py-3 will-change-transform"
                  >
                    <p className="type-body-sm font-medium text-zinc-200">Filtered Results</p>
                    <p className="type-body-sm text-zinc-500 mt-1">New state settles into view.</p>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <DemoHint>Good default: <CodeToken>duration-150</CodeToken> or <CodeToken>duration-200</CodeToken>.</DemoHint>
                <Button size="xs" variant="outline" onClick={() => setDurationReplayKey((current) => current + 1)}>
                  <RotateCcw />
                  Replay
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Directional Easing</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          Same distance, same duration, different easing. Click replay and watch how each dot starts and finishes its travel.
        </p>

        <Panel className="overflow-hidden">
          <PanelHeader
            title="Compare The Curves"
            description="All three lanes travel left to right. What changes is the acceleration profile."
            meta={<CodeToken>ease-out / ease-in / ease-in-out</CodeToken>}
          />
          <div className="p-4 space-y-4">
            {EASING_LANES.map((lane) => (
              <div key={lane.title} className="rounded-md border border-zinc-800/50 bg-zinc-950/40 p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="type-body-sm font-medium text-zinc-200">{lane.title}</p>
                    <p className="type-body-sm text-zinc-500">{lane.note}</p>
                  </div>
                  <CodeToken>{lane.token}</CodeToken>
                </div>
                <div className="flex items-center justify-between text-2xs font-mono text-zinc-600 mb-2">
                  <span>START</span>
                  <span>END</span>
                </div>
                <div className="relative h-6 rounded-full border border-zinc-800/50 bg-zinc-900 overflow-hidden">
                  <motion.div
                    key={`${lane.title}-${easingReplayKey}`}
                    initial={{ x: 0 }}
                    animate={{ x: "calc(100% - 20px)" }}
                    transition={{ duration: 1, ease: lane.curve }}
                    className="absolute inset-y-0 left-0 right-0 will-change-transform"
                  >
                    <div className="absolute top-0.5 left-0 size-5 rounded-full bg-teal-400" />
                  </motion.div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <DemoHint>
                <CodeToken>ease-out</CodeToken> should look like it settles. <CodeToken>ease-in</CodeToken> should look like it departs.
              </DemoHint>
              <Button size="xs" variant="outline" onClick={() => setEasingReplayKey((current) => current + 1)}>
                <Play />
                Replay lanes
              </Button>
            </div>
          </div>
        </Panel>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Pop-In Surfaces</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          This is the motion pattern for menus and popovers. The contrast below should make the right answer obvious.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel className="overflow-hidden">
            <PanelHeader
              title="Recommended"
              description="Origin-aware, starts at 0.95, settles with a spring."
              meta={<CodeToken>transform-origin: top left</CodeToken>}
            />
            <div className="p-4 space-y-4">
              <div className="rounded-md border border-zinc-800/50 bg-zinc-950/50 p-4 min-h-48">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-md border border-zinc-700/60 bg-zinc-900 px-3 py-2 type-body-sm text-zinc-200"
                >
                  Toggle menu
                </button>
                <div className="relative mt-3 h-28">
                  <AnimatePresence initial={false}>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        transition={SPRING.menu}
                        style={{ transformOrigin: "top left" }}
                        className="absolute left-0 top-0 w-56 rounded-md border border-zinc-700/60 bg-zinc-900 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)] will-change-transform"
                      >
                        <p className="type-body-sm font-medium text-zinc-200">Display options</p>
                        <div className="mt-3 space-y-2">
                          <div className="rounded bg-zinc-800/70 px-2 py-1.5 type-body-sm text-zinc-400">Compact density</div>
                          <div className="rounded bg-zinc-800/40 px-2 py-1.5 type-body-sm text-zinc-400">Show metadata</div>
                          <div className="rounded bg-zinc-800/40 px-2 py-1.5 type-body-sm text-zinc-400">Sort by newest</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <DemoHint>Notice that the surface feels attached to the trigger and does not “teleport” into scale.</DemoHint>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader
              title="Avoid"
              description="Scale-from-zero feels synthetic and detached."
              meta={<CodeToken>avoid scale(0)</CodeToken>}
            />
            <div className="p-4 space-y-4">
              <div className="rounded-md border border-zinc-800/50 bg-zinc-950/50 p-4 min-h-48">
                <motion.div
                  key={menuOpen ? "bad-open" : "bad-closed"}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-56 rounded-md border border-red-400/20 bg-red-400/5 p-3 will-change-transform"
                >
                  <p className="type-body-sm font-medium text-zinc-200">Bad reference</p>
                  <p className="type-body-sm text-zinc-500 mt-2">
                    It arrives from nowhere, with no clear relationship to the trigger.
                  </p>
                </motion.div>
              </div>
              <DemoHint>Bad motion is often just disconnected motion, not obviously flashy motion.</DemoHint>
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">State Hand-Off</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          This demo answers a simple question: when content changes meaningfully, how should one state hand off to the next?
        </p>

        <Panel className="overflow-hidden">
          <PanelHeader
            title="Sequential Swap"
            description="Fade one state out, then bring the next one in."
            meta={<CodeToken>AnimatePresence mode=&quot;wait&quot;</CodeToken>}
          />
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              {SWAP_STATES.map((state, index) => (
                <Button
                  key={state.id}
                  size="xs"
                  variant={index === swapIndex ? "secondary" : "outline"}
                  onClick={() => setSwapIndex(index)}
                >
                  {state.title}
                </Button>
              ))}
            </div>

            <div className="rounded-md border border-zinc-800/50 bg-zinc-950/50 p-4 min-h-36">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={SWAP_STATES[swapIndex].id}
                  initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 4, filter: "blur(8px)" }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="will-change-transform"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="type-body-sm font-medium text-zinc-200">{SWAP_STATES[swapIndex].title}</p>
                    <CodeToken className="text-zinc-500">{SWAP_STATES[swapIndex].meta}</CodeToken>
                  </div>
                  <p className="type-body-sm text-zinc-500 mt-3 max-w-xl">{SWAP_STATES[swapIndex].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <DemoHint>A crossfade would show both states at once. For dense admin content, that is harder to read.</DemoHint>
          </div>
        </Panel>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Staggered Batch Entry</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          Use stagger for list refreshes and batch entry, not for every tiny row update.
        </p>

        <Panel className="overflow-hidden">
          <PanelHeader
            title="Replay The Batch"
            description="A short stagger keeps the update readable without slowing it down."
            meta={<CodeToken>40ms stagger / 200ms entry</CodeToken>}
          />
          <div className="p-4 space-y-4">
            <motion.div
              key={staggerReplayKey}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
              className="space-y-2"
            >
              {STAGGER_ITEMS.map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="rounded-md border border-zinc-800/50 bg-zinc-950/50 px-4 py-3 will-change-transform"
                >
                  <span className="type-body-sm text-zinc-300">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <DemoHint>Good stagger is subtle. You should perceive order, not theatrical delay.</DemoHint>
              <Button size="xs" variant="outline" onClick={() => setStaggerReplayKey((current) => current + 1)}>
                <RotateCcw />
                Replay
              </Button>
            </div>
          </div>
        </Panel>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-2">Opinionated Rules</h2>
        <p className="type-body-sm text-zinc-500 mb-6">
          These rules are narrow on purpose. They should reduce motion decisions across the product, not create a playground for them.
        </p>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel className="overflow-hidden">
            <PanelHeader title="Core Rules" description="What most UI motion should obey in this repo." />
            <div className="p-4">
              <ul className="space-y-2">
                {CORE_RULES.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 type-body-sm text-zinc-400">
                    <span className="text-zinc-600 shrink-0">&bull;</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Surface Rules" description="How menus, overlays, and triggers should behave." />
            <div className="p-4">
              <ul className="space-y-2">
                {SURFACE_RULES.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 type-body-sm text-zinc-400">
                    <span className="text-zinc-600 shrink-0">&bull;</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
