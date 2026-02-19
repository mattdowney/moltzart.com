import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { Radar } from "lucide-react";
import type { DbRadarItem } from "@/lib/db";
import { Panel } from "@/components/admin/panel";
import { LaneTag } from "@/components/admin/tag-badge";
import { getWeekMonday } from "@/lib/newsletter-weeks";

interface RadarHighlightsProps {
  date: string;
  items: DbRadarItem[];
  today: string;
}

export function RadarHighlights({ date, items, today }: RadarHighlightsProps) {
  const isToday = date === today;
  return (
    <Panel className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30">
        <div className="flex items-center gap-2">
          <Radar size={14} className="text-teal-500" />
          <span className="text-sm font-medium text-zinc-200">
            {isToday ? "Today's Radar" : "Latest Scan"}
          </span>
          {date !== "—" && !isToday && <span className="text-xs text-zinc-600 font-mono">{date}</span>}
        </div>
        <Link
          href="/admin/radar"
          className="text-xs text-zinc-500 hover:text-teal-400 transition-colors flex items-center gap-1"
        >
          All scans <ArrowUpRight size={10} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <EmptyState icon={Radar} message="No radar scan today" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
          {items.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={`/admin/radar/${getWeekMonday(item.date)}`}
              className="block px-4 py-4 hover:bg-zinc-800/40 transition-colors"
            >
              <LaneTag lane={item.lane} />
              <p className="text-sm text-zinc-200 mt-1">{item.title}</p>
              {item.why_bullets?.[0] && (
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{item.why_bullets[0]}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Panel>
  );
}
