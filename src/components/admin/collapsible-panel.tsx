"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/admin/panel";

interface CollapsiblePanelProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  titleClassName?: string;
  iconClassName?: string;
  meta?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCollapsed?: boolean;
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
}

export function CollapsiblePanel({
  icon: Icon,
  title,
  description,
  titleClassName,
  iconClassName,
  meta,
  open,
  onOpenChange,
  defaultCollapsed = false,
  children,
  emptyState,
  bodyClassName,
  className,
}: CollapsiblePanelProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = open == null ? internalCollapsed : !open;
  const Chevron = collapsed ? ChevronRight : ChevronDown;
  const hasContent = Boolean(children);

  function handleToggle() {
    const nextOpen = collapsed;
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }
    setInternalCollapsed((value) => !value);
  }

  return (
    <Panel className={cn("flex flex-col", className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/20 transition-colors"
      >
        <Icon size={16} className={cn("shrink-0 text-zinc-500", iconClassName)} />
        <div className="min-w-0 flex-1">
          <span className={cn("type-body-sm font-medium text-zinc-200 block", titleClassName)}>
            {title}
          </span>
          {description && (
            <span className="mt-1 block type-body-sm text-zinc-500">
              {description}
            </span>
          )}
        </div>
        {meta && <div className="flex items-center gap-2 shrink-0">{meta}</div>}
        <Chevron size={14} className="text-zinc-600 shrink-0" />
      </button>

      {!collapsed && (
        <div className={cn("border-t border-zinc-800/30", bodyClassName)}>
          {hasContent ? children : emptyState}
        </div>
      )}
    </Panel>
  );
}
