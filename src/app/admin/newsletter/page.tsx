import { redirect } from "next/navigation";
import { getCurrentWeekMonday } from "@/lib/newsletter-weeks";

export const dynamic = "force-dynamic";

export default function AdminNewsletterPage() {
  // Use ET-aware helper so late Friday evenings don't roll into next week
  const currentMonday = getCurrentWeekMonday();
  redirect(`/admin/newsletter/${currentMonday}`);
}
