import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="max-h-svh overflow-y-auto bg-zinc-950">
        <header className="flex items-center gap-2 px-4 py-3 md:hidden">
          <SidebarTrigger className="size-8 text-zinc-400" />
        </header>
        <main className="flex-1 w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
