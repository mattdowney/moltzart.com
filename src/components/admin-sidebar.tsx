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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Paintbrush, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav, type SidebarNavItem } from "@/components/admin/sidebar-nav";
import { adminNavItems } from "@/lib/admin-nav";

const isAdminNavItemActive = (item: SidebarNavItem, pathname: string) =>
  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

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
            items={adminNavItems}
            pathname={pathname}
            label=""
            isItemActive={isAdminNavItemActive}
            onNavigate={() => setOpenMobile(false)}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 bg-zinc-900/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="focus-visible:ring-0">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem
                  onSelect={() => {
                    setOpenMobile(false);
                    router.push("/admin/styleguide");
                  }}
                >
                  <Paintbrush />
                  Styleguide
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    window.location.href = "/api/auth/signout";
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
