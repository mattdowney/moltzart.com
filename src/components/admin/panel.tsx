import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { adminSurfaceVariants } from "@/components/admin/surface";
import {
  adminCardBodyClass,
  adminCardMetaClass,
  adminCardTitleClass,
} from "@/components/admin/card-content";

export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(adminSurfaceVariants({ variant: "section" }), className)}
      {...props}
    />
  );
}

interface PanelHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  titleClassName?: string;
  iconClassName?: string;
  meta?: React.ReactNode;
  metaClassName?: string;
  action?: { label: string; href: string };
  children?: React.ReactNode;
}

export function PanelHeader({
  icon: Icon,
  title,
  description,
  count,
  countLabel,
  titleClassName,
  iconClassName,
  meta,
  metaClassName,
  action,
  children,
}: PanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-800/40 px-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && <Icon size={14} className={cn("shrink-0 text-zinc-400", iconClassName)} />}
          <span className={cn(adminCardTitleClass, "truncate text-zinc-200", titleClassName)}>{title}</span>
          {count != null && (
            <span className={cn("shrink-0", adminCardMetaClass)}>
              {count} {countLabel ?? "items"}
            </span>
          )}
          {children}
        </div>
        {description && <p className={cn("mt-1", adminCardBodyClass)}>{description}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {meta && <div className={cn(adminCardMetaClass, metaClassName)}>{meta}</div>}
        {action && (
          <Link
            href={action.href}
            className={cn("flex items-center gap-1 transition-colors hover:text-teal-400", adminCardMetaClass)}
          >
            {action.label} <ArrowUpRight size={10} />
          </Link>
        )}
      </div>
    </div>
  );
}
