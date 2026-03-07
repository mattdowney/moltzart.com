import type { LucideIcon } from "lucide-react";
import { CollapsiblePanel } from "@/components/admin/collapsible-panel";

interface CollectionPanelProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  meta?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

export function CollectionPanel({
  icon,
  title,
  description,
  count,
  countLabel = "items",
  meta,
  iconClassName,
  titleClassName,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  bodyClassName,
  children,
}: CollectionPanelProps) {
  const countMeta = count != null ? (
    <span className="type-body-sm text-zinc-500">
      {count} {countLabel}
    </span>
  ) : null;

  return (
    <CollapsiblePanel
      icon={icon}
      title={title}
      description={description}
      meta={
        <>
          {countMeta}
          {meta}
        </>
      }
      iconClassName={iconClassName}
      titleClassName={titleClassName}
      open={open}
      onOpenChange={onOpenChange}
      defaultCollapsed={!defaultOpen}
      className={className}
      bodyClassName={bodyClassName}
    >
      {children}
    </CollapsiblePanel>
  );
}
