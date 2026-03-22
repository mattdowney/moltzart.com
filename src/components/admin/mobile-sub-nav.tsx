"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "@/components/admin/sidebar-nav";

interface MobileSubNavProps {
  items: SidebarNavItem[];
  pathname: string;
  isItemActive?: (item: SidebarNavItem, pathname: string) => boolean;
  className?: string;
}

const defaultIsActive = (item: SidebarNavItem, pathname: string) =>
  pathname === item.href;

export function MobileSubNav({
  items,
  pathname,
  isItemActive = defaultIsActive,
  className,
}: MobileSubNavProps) {
  return (
    <nav
      className={cn(
        "md:hidden -mx-4 px-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="flex items-center gap-1.5 pb-1">
        {items.map((item) => {
          const active = isItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 type-body-sm transition-colors",
                active
                  ? "bg-teal-400/10 text-teal-400"
                  : "bg-zinc-800/40 text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon size={12} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
