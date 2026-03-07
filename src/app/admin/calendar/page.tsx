import { CalendarView } from "@/components/calendar-view";
import { getCronCalendarData } from "@/lib/openclaw-crons";

export const dynamic = "force-dynamic";

function getWeekRange(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // Monday-start: Sun(0)->-6, Mon(1)->0, Tue(2)->-1, ...
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return { start: fmt(mon), end: fmt(sun) };
}

export default async function AdminCalendar() {
  const now = new Date();
  const { start, end } = getWeekRange(now);
  const data = await getCronCalendarData(start, end);

  return (
    <CalendarView
      initialData={data}
      initialStart={start}
    />
  );
}
