"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Briefcase, CalendarDays, CheckSquare, FileText, LayoutDashboard, LogOut, Newspaper, Paintbrush } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNav, type SidebarNavItem } from "@/components/admin/sidebar-nav";

const navItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
  { label: "Crons", href: "/admin/calendar", icon: CalendarDays },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Styleguide", href: "/admin/styleguide", icon: Paintbrush },
];

const isAdminNavItemActive = (item: SidebarNavItem, pathname: string) =>
  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    window.location.href = "/api/auth/signout";
  };

  return (
    <Sidebar collapsible="offcanvas" className="min-h-svh border-r border-sidebar-border/80 bg-sidebar">
      <SidebarHeader className="px-4 pt-5 pb-3">
        <Link href="/" prefetch={false}>
          <Image
            src="/avatar.jpg"
            alt="Moltzart"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarNav
            className="px-2"
            items={navItems}
            pathname={pathname}
            label="Workspace"
            isItemActive={isAdminNavItemActive}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 bg-zinc-900/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
