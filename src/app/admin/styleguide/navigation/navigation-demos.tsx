"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CodeToken } from "@/components/admin/code-token";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { SummaryCard } from "@/components/admin/summary-card";
import { cn } from "@/lib/utils";
import {
  CONTENT_STATES,
  COUNT_PATTERNS,
  MOTION,
  OVERFLOW_ITEMS,
  RAIL_SPECS,
  SEGMENT_ITEMS,
  TIMING,
} from "./navigation-data";

type SegmentValue = (typeof SEGMENT_ITEMS)[number]["value"];
type ContentStateValue = (typeof CONTENT_STATES)[number]["value"];
type OverflowValue = (typeof OVERFLOW_ITEMS)[number]["value"];

export function CountPreview({
  title,
  note,
  defaultValue,
  items,
}: (typeof COUNT_PATTERNS)[number]) {
  const [value, setValue] = useState<(typeof items)[number]["value"]>(defaultValue);

  return (
    <Panel className="overflow-hidden">
      <PanelHeader title={title} description={note} />
      <div className="p-4">
        <div className="flex h-8 w-full rounded-md bg-zinc-900/70 p-0.5">
          {items.map((item) => {
            const isActive = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue(item.value)}
                className={cn(
                  "relative inline-flex h-full flex-1 items-center justify-center rounded-[6px] px-3 text-xs font-medium transition-colors",
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={`count-preview-${title}`}
                    transition={MOTION.indicator}
                    className="absolute inset-0 rounded-[6px] bg-zinc-50"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

export function RailSpecPreview(spec: (typeof RAIL_SPECS)[number]) {
  const [value, setValue] = useState<SegmentValue>("overview");

  return (
    <Panel className="overflow-hidden">
      <PanelHeader title={spec.name} description={spec.use} meta={<CodeToken>{spec.rail}</CodeToken>} />
      <div className="space-y-4 p-4">
        <div className={cn("flex w-full rounded-md", spec.listClassName)}>
          {SEGMENT_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue(item.value)}
                className={cn(
                  "relative inline-flex h-full flex-1 items-center justify-center rounded-[6px] transition-colors",
                  spec.triggerClassName,
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={`rail-spec-${spec.name}`}
                    transition={MOTION.indicator}
                    className="absolute inset-0 rounded-[6px] bg-zinc-50"
                  />
                )}
                <span className="relative z-10 inline-flex items-center justify-center gap-inherit">
                  <Icon />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/40 p-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500">
            <p className="type-body-sm">
              Trigger: <CodeToken>{spec.trigger}</CodeToken>
            </p>
            <p className="type-body-sm">
              Icon: <CodeToken>{spec.icon}</CodeToken>
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function AnimatedFilledTabs() {
  const [value, setValue] = useState<SegmentValue>("overview");

  return (
    <div className="flex h-8 w-fit rounded-md bg-zinc-900/70 p-0.5">
      {SEGMENT_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setValue(item.value)}
            className={cn(
              "relative inline-flex h-full items-center justify-center gap-1.5 rounded-[6px] px-3 text-xs font-medium transition-colors",
              isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filled-tab-indicator"
                transition={MOTION.indicator}
                className="absolute inset-0 rounded-[6px] bg-zinc-50"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <Icon size={12} />
              <span>{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MotionPreview() {
  const [value, setValue] = useState<ContentStateValue>("overview");
  const activeItem = CONTENT_STATES.find((item) => item.value === value) ?? CONTENT_STATES[0];
  const Icon = activeItem.icon;

  return (
    <div className="space-y-4">
      <div className="relative flex items-end gap-5 border-b border-zinc-800">
        {CONTENT_STATES.map((item) => {
          const isActive = value === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setValue(item.value)}
              className={cn(
                "relative pb-2 text-xs font-medium transition-colors",
                isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <span>{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="line-tab-indicator"
                  transition={MOTION.indicator}
                  className="absolute inset-x-0 bottom-[-1px] h-px bg-teal-400"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-28">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.value}
            initial={{ opacity: 0, y: 10, scale: 0.985, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(6px)" }}
            transition={{
              opacity: { duration: MOTION.enter.duration, ease: MOTION.enter.ease },
              y: { duration: MOTION.enter.duration, ease: MOTION.enter.ease },
              scale: { duration: MOTION.exit.duration, ease: MOTION.exit.ease },
              filter: { duration: TIMING.indicatorSettle / 1000, ease: MOTION.exit.ease },
            }}
            className="will-change-transform"
          >
            <SummaryCard
              icon={Icon}
              title={activeItem.title}
              meta={<CodeToken>{activeItem.meta}</CodeToken>}
              description={activeItem.body}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function OverflowPreview() {
  const [value, setValue] = useState<OverflowValue>("projects");

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max rounded-md bg-zinc-900/70 p-0.5">
          {OVERFLOW_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue(item.value)}
                className={cn(
                  "relative inline-flex h-7 flex-none items-center justify-center gap-1.5 rounded-[6px] px-3 text-xs font-medium transition-colors",
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="overflow-tab-indicator"
                    transition={MOTION.indicator}
                    className="absolute inset-0 rounded-[6px] bg-zinc-50"
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <Icon size={12} />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-800/60 bg-zinc-950/40 p-4">
        <p className="type-body-sm text-zinc-400">
          If the rail needs to scroll horizontally, keep it intentional: preserve a comfortable hit area,
          hide the scrollbar chrome, and do not squeeze labels until they wrap.
        </p>
      </div>
    </div>
  );
}
