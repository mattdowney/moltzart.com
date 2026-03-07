"use client";

import type { ReactNode } from "react";
import { FolderOpen, Inbox } from "lucide-react";
import { CollapsiblePanel } from "@/components/admin/collapsible-panel";

interface ResearchGroupProps {
  title: string;
  count: number;
  isUnassigned?: boolean;
  children: ReactNode;
}

export function ResearchGroup({ title, count, isUnassigned, children }: ResearchGroupProps) {
  const Icon = isUnassigned ? Inbox : FolderOpen;

  return (
    <CollapsiblePanel
      icon={Icon}
      title={title}
      meta={<span className="type-body-sm text-zinc-600">{count} artifact{count !== 1 ? "s" : ""}</span>}
      bodyClassName="border-t-0"
      className="overflow-hidden bg-zinc-900/30"
    >
      {children}
    </CollapsiblePanel>
  );
}
