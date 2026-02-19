import { redirect } from "next/navigation";
import { getCurrentWeekMonday } from "@/lib/newsletter-weeks";

export default function AdminDraftsPage() {
  redirect(`/admin/drafts/${getCurrentWeekMonday()}`);
}
