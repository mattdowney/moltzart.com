import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { Panel } from "@/components/admin/panel";
import { getWeekMonday } from "@/lib/newsletter-weeks";
import type { DbEngageItem } from "@/lib/db";

interface EngageHighlightsProps {
  items: DbEngageItem[];
  date: string | null;
}

export function EngageHighlights({ items, date }: EngageHighlightsProps) {
  return (
    <Panel className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/30">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-teal-500" />
          <span className="text-sm font-medium text-zinc-200">Reply Targets</span>
          {date && <span className="text-xs text-zinc-600 font-mono">{date}</span>}
        </div>
        <Link
          href="/admin/engage"
          className="text-xs text-zinc-500 hover:text-teal-400 transition-colors flex items-center gap-1"
        >
          View all <ArrowUpRight size={10} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <EmptyState icon={MessageCircle} message="No targets from Pica yet." />
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/40">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/engage/${getWeekMonday(item.date)}`}
              className="block px-4 py-4 hover:bg-zinc-800/40 transition-colors"
            >
              {item.author && (
                <span className="text-xs text-teal-400 font-medium">{item.author}</span>
              )}
              <p className="text-sm text-zinc-200 truncate">{item.title}</p>
              {item.context && (
                <p className="text-xs text-zinc-500 truncate">{item.context}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Panel>
  );
}
