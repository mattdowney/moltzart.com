"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

const durations = [
  { label: "Fast", ms: 100, tailwind: "duration-100" },
  { label: "Normal", ms: 200, tailwind: "duration-200" },
  { label: "Slow", ms: 300, tailwind: "duration-300" },
];

const easings = [
  { label: "Ease out (enter)", css: "cubic-bezier(0.16, 1, 0.3, 1)", usage: "Appearing elements" },
  { label: "Ease in (exit)", css: "cubic-bezier(0.7, 0, 0.84, 0)", usage: "Disappearing elements" },
];

const motionRules = [
  "Max 300ms — never use duration-500 or higher",
  "GPU-only properties: transform and opacity",
  "Avoid animating width, height, top, left, margin, padding",
  "Don't add Motion to shadcn overlays — they have built-in transitions",
  "Use ease-out for entering, ease-in for exiting",
  "Don't animate from scale(0) — start from 0.95 or higher",
];

export default function MotionPage() {
  const [durationAnimate, setDurationAnimate] = useState<number | null>(null);
  const [showPresence, setShowPresence] = useState(true);
  const [staggerKey, setStaggerKey] = useState(0);

  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Durations */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Duration Scale</h2>
        <p className="type-body-sm text-zinc-500 mb-4">Click each box to see its animation duration:</p>
        <div className="flex items-center gap-4">
          {durations.map((d) => (
            <button
              key={d.ms}
              onClick={() => {
                setDurationAnimate(null);
                requestAnimationFrame(() => setDurationAnimate(d.ms));
              }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-lg border border-zinc-700/50 bg-zinc-800/60 flex items-center justify-center cursor-pointer hover:bg-zinc-800/80"
                style={
                  durationAnimate === d.ms
                    ? { animation: `pulse ${d.ms}ms ease-out`, backgroundColor: "oklch(0.3 0.06 192 / 0.4)" }
                    : undefined
                }
              >
                <span className="type-body font-medium text-zinc-200">{d.ms}</span>
              </div>
              <p className="text-2xs font-mono text-zinc-400 mt-2">{d.tailwind}</p>
              <p className="type-body-sm text-zinc-500">{d.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Easings */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Easing Curves</h2>
        <div className="space-y-3">
          {easings.map((e) => (
            <div key={e.label} className="space-y-1">
              <span className="type-body font-medium text-zinc-200">{e.label}</span>
              <p className="text-2xs font-mono text-teal-400">{e.css}</p>
              <p className="type-body-sm text-zinc-500">{e.usage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transitions */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Transitions</h2>
        <div className="space-y-3">
          <div className="inline-block rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors px-4 py-3 cursor-pointer">
            <span className="type-body-sm text-zinc-300">Hover — transition-colors</span>
          </div>
          <div>
            <button className="rounded-lg border border-zinc-800/50 bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] transition-all duration-150 px-4 py-3 type-body-sm font-medium text-zinc-200">
              Press — active:scale-[0.98]
            </button>
          </div>
        </div>
      </section>

      {/* Framer Motion */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Framer Motion Presets</h2>
        <div className="space-y-6">
          <div>
            <p className="type-body-sm text-zinc-400 mb-2">fadeIn / slideUp</p>
            <AnimatePresence mode="wait">
              {showPresence && (
                <motion.div
                  key="slide"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3"
                >
                  <span className="type-body-sm text-zinc-300">Animated element</span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button size="xs" variant="outline" className="mt-3" onClick={() => setShowPresence(!showPresence)}>
              Toggle
            </Button>
          </div>

          <div>
            <p className="type-body-sm text-zinc-400 mb-2">staggerChildren</p>
            <motion.div
              key={staggerKey}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="space-y-2"
            >
              {["First", "Second", "Third", "Fourth"].map((label) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2"
                >
                  <span className="type-body-sm text-zinc-300">{label} item</span>
                </motion.div>
              ))}
            </motion.div>
            <Button size="xs" variant="outline" className="mt-3" onClick={() => setStaggerKey((k) => k + 1)}>
              Replay
            </Button>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Rules</h2>
        <ul className="space-y-2">
          {motionRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2 type-body-sm text-zinc-400">
              <span className="text-zinc-600 shrink-0">&bull;</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
