"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Palette,
  Type,
  RectangleHorizontal,
  TextCursorInput,
  CircleDot,
  LayoutGrid,
  Ruler,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin/styleguide/palette", label: "Palette", icon: Palette },
  { href: "/admin/styleguide/typography", label: "Typography", icon: Type },
  { href: "/admin/styleguide/buttons", label: "Buttons", icon: RectangleHorizontal },
  { href: "/admin/styleguide/form-elements", label: "Form Elements", icon: TextCursorInput },
  { href: "/admin/styleguide/badges", label: "Badges", icon: CircleDot },
  { href: "/admin/styleguide/cards", label: "Cards", icon: LayoutGrid },
  { href: "/admin/styleguide/spacing", label: "Spacing", icon: Ruler },
  { href: "/admin/styleguide/motion", label: "Motion", icon: Zap },
];

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <PageHeader title="Styleguide" subtitle="Design system reference for moltzart.com" />

      <div className="flex gap-10 mt-8">
        {/* Left sidebar nav */}
        <nav className="sticky top-6 self-start w-48 shrink-0 hidden md:block">
          <p className="text-2xs uppercase tracking-[0.08em] font-medium text-zinc-500 mb-3 px-3">Navigation</p>
          <ul className="space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md type-body-sm transition-colors",
                      isActive
                        ? "text-teal-400 bg-teal-400/10"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                    )}
                  >
                    <link.icon size={14} className="shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
