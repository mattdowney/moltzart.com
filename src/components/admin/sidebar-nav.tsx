"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type SidebarNavProps = {
  items: SidebarNavItem[];
  pathname: string;
  label?: string;
  className?: string;
  itemClassName?: string;
  isItemActive?: (item: SidebarNavItem, pathname: string) => boolean;
  onNavigate?: () => void;
};

const defaultIsItemActive = (item: SidebarNavItem, pathname: string) => pathname === item.href;

export function SidebarNav({
  items,
  pathname,
  label,
  className,
  itemClassName,
  isItemActive = defaultIsItemActive,
  onNavigate,
}: SidebarNavProps) {
  return (
    <div className={className}>
      {label ? (
        <p className="mb-3 px-3 text-2xs font-medium uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      ) : null}

      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = isItemActive(item, pathname);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={false}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 type-body-sm transition-colors",
                  isActive
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300",
                  itemClassName
                )}
              >
                <item.icon size={14} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
