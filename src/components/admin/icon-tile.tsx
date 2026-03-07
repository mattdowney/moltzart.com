import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminIconTileProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function AdminIconTile({
  icon: Icon,
  className,
  iconClassName,
}: AdminIconTileProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-teal-400/25 bg-teal-400/10 p-2.5 text-teal-400",
        className
      )}
    >
      <Icon size={16} className={cn(iconClassName)} />
    </div>
  );
}
