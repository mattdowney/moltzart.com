"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getAdminPageTitle } from "@/lib/admin-nav";

export function AdminMobileHeader() {
  const pathname = usePathname();
  const title = getAdminPageTitle(pathname);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:hidden border-b border-zinc-800/40">
      <SidebarTrigger className="size-11 text-zinc-400" />
      <span className="text-base font-medium text-zinc-200">{title}</span>
      <Link href="/" prefetch={false}>
        <Image
          src="/avatar.jpg"
          alt="Moltzart"
          width={32}
          height={32}
          className="size-8 rounded-full hover:opacity-80 transition-opacity"
        />
      </Link>
    </header>
  );
}
