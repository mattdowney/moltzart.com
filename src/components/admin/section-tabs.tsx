"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SectionTabItem {
  id: string;
  label: string;
  count?: number;
}

interface SectionTabsProps {
  items: SectionTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: "line" | "filled";
  className?: string;
}

export function SectionTabs({
  items,
  value,
  onValueChange,
  variant = "line",
  className,
}: SectionTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList
        variant={variant === "line" ? "line" : "default"}
        className={cn(
          variant === "line"
            ? "w-full justify-start border-b border-zinc-800/60 pb-0"
            : "w-fit rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-1"
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className={cn(
              "gap-2 px-0 py-3 text-sm font-medium data-[state=active]:text-zinc-100",
              variant === "line"
                ? "mr-6 rounded-none border-0 text-zinc-500 after:bg-teal-400 data-[state=active]:after:h-0.5"
                : "rounded-lg px-3 py-2 text-zinc-400 data-[state=active]:bg-zinc-800/80"
            )}
          >
            <span>{item.label}</span>
            {item.count != null && (
              <span className="type-badge text-zinc-500">{item.count}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
