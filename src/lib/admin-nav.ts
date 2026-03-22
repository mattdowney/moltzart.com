import {
  Briefcase,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Newspaper,
  Paintbrush,
} from "lucide-react";
import type { SidebarNavItem } from "@/components/admin/sidebar-nav";

export const adminNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
  { label: "Crons", href: "/admin/calendar", icon: CalendarDays },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
  { label: "Documents", href: "/admin/documents", icon: FileText },
  { label: "Styleguide", href: "/admin/styleguide", icon: Paintbrush },
];

export function getAdminPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const match = adminNavItems.find(
    (item) => item.href !== "/admin" && pathname.startsWith(item.href)
  );
  return match?.label ?? "Admin";
}
