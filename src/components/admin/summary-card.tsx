import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { AdminIconTile } from "@/components/admin/icon-tile";
import {
  adminCardBodyClass,
  adminCardMetaClass,
  adminCardStackClass,
  adminCardTitleClass,
} from "@/components/admin/card-content";

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: React.ReactNode;
  className?: string;
}

export function SummaryCard({
  icon: Icon,
  title,
  description,
  meta,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        adminSurfaceVariants({ variant: "section" }),
        "px-4 py-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AdminIconTile icon={Icon} className="mt-0.5" />
        <div className={cn("min-w-0", adminCardStackClass)}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className={adminCardTitleClass}>{title}</h3>
            {meta && <div className={cn("shrink-0", adminCardMetaClass)}>{meta}</div>}
          </div>
          <p className={adminCardBodyClass}>{description}</p>
        </div>
      </div>
    </div>
  );
}
