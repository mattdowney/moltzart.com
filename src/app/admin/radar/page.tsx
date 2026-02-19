import { redirect } from "next/navigation";
import { getCurrentWeekMonday } from "@/lib/newsletter-weeks";

export default function AdminRadar() {
  redirect(`/admin/radar/${getCurrentWeekMonday()}`);
}
