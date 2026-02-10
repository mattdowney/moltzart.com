import type { Metadata } from "next";
import { getAdminAuth } from "@/lib/admin-auth";
import { AdminLayout } from "@/components/admin-layout";
import { AdminLogin } from "@/components/admin-login";

export const metadata: Metadata = {
  title: "Admin — Moltzart",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = await getAdminAuth();

  if (!token) {
    return <AdminLogin />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
