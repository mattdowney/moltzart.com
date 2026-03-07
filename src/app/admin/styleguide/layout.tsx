"use client";

import { usePathname } from "next/navigation";
import {
  Palette,
  Type,
  RectangleHorizontal,
  TextCursorInput,
  CircleDot,
  LayoutGrid,
  PanelsTopLeft,
  Ruler,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SidebarNav, type SidebarNavItem } from "@/components/admin/sidebar-nav";

const navLinks: SidebarNavItem[] = [
  { href: "/admin/styleguide/palette", label: "Palette", icon: Palette },
  { href: "/admin/styleguide/typography", label: "Typography", icon: Type },
  { href: "/admin/styleguide/buttons", label: "Buttons", icon: RectangleHorizontal },
  { href: "/admin/styleguide/form-elements", label: "Form Elements", icon: TextCursorInput },
  { href: "/admin/styleguide/navigation", label: "Navigation", icon: PanelsTopLeft },
  { href: "/admin/styleguide/badges", label: "Badges", icon: CircleDot },
  { href: "/admin/styleguide/cards", label: "Cards", icon: LayoutGrid },
  { href: "/admin/styleguide/spacing", label: "Spacing", icon: Ruler },
  { href: "/admin/styleguide/motion", label: "Motion", icon: Zap },
];

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <PageHeader title="Styleguide" />

      <div className="flex gap-10 mt-8">
        {/* Left sidebar nav */}
        <nav className="sticky top-6 self-start w-48 shrink-0 hidden md:block">
          <SidebarNav items={navLinks} pathname={pathname} label="Navigation" />
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
