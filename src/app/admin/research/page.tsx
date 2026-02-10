import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { fetchResearchList, type ResearchDoc } from "@/lib/github";

export const dynamic = "force-dynamic";

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const docDate = new Date(d.toLocaleString("en-US", { timeZone: "America/New_York" }));

  today.setHours(0, 0, 0, 0);
  docDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - docDate.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

interface DateGroup {
  label: string;
  docs: ResearchDoc[];
}

function groupByDate(docs: ResearchDoc[]): DateGroup[] {
  const groups: Map<string, ResearchDoc[]> = new Map();

  for (const doc of docs) {
    if (!doc.createdAt) {
      const key = "_unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(doc);
      continue;
    }
    const d = new Date(doc.createdAt);
    const dateKey = d.toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey)!.push(doc);
  }

  return Array.from(groups.entries()).map(([key, docs]) => ({
    label: key === "_unknown" ? "Unknown date" : formatDateLabel(docs[0].createdAt!),
    docs,
  }));
}

export default async function AdminResearch() {
  const docs = await fetchResearchList();
  const groups = groupByDate(docs);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6">Research</h1>
      {docs.length === 0 ? (
        <p className="text-sm text-zinc-500">No research documents yet.</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 px-1">
                {group.label}
              </h2>
              <div className="space-y-1.5">
                {group.docs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/admin/research/${doc.slug}`}
                    className="flex items-center gap-3 px-4 py-3 border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors group"
                  >
                    <FileText size={16} className="text-zinc-500 shrink-0" />
                    <span className="text-sm text-zinc-200 flex-1">{doc.title}</span>
                    {doc.createdAt && (
                      <span className="text-xs text-zinc-600 shrink-0">
                        {formatTime(doc.createdAt)}
                      </span>
                    )}
                    <ArrowRight
                      size={14}
                      className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
