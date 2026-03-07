import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  adminCardBodyClass,
  adminCardStackClass,
  adminCardTitleClass,
} from "@/components/admin/card-content";
import { AdminIconTile } from "@/components/admin/icon-tile";

interface EmptyStateProps {
  icon: LucideIcon;
  message?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
  align?: "center" | "start";
}

export function EmptyState({
  icon: Icon,
  message,
  title,
  description,
  action,
  className,
  iconClassName,
  align = "center",
}: EmptyStateProps) {
  const body = description ?? message ?? "";
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex py-16",
        centered ? "flex-col items-center justify-center text-center" : "items-start gap-3 text-left",
        className
      )}
    >
      <AdminIconTile
        icon={Icon}
        className={cn(centered ? "mb-4" : "shrink-0", iconClassName && "border-current/20 bg-current/10")}
        iconClassName={iconClassName}
      />
      <div className={cn(centered ? "contents" : "min-w-0", !centered && adminCardStackClass)}>
        {title ? <p className={adminCardTitleClass}>{title}</p> : null}
        {body ? <p className={cn(adminCardBodyClass, title ? "" : "mt-0")}>{body}</p> : null}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
