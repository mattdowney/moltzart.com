import { cn } from "@/lib/utils";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { adminCardBodyClass, adminCardLabelClass } from "@/components/admin/card-content";

type MetricTone = "default" | "teal" | "amber" | "red" | "green";

interface MetricStripItem {
  label: string;
  value: React.ReactNode;
  note?: string;
  tone?: MetricTone;
}

interface MetricStripProps {
  items: MetricStripItem[];
  className?: string;
}

const toneClassNames: Record<MetricTone, string> = {
  default: "text-zinc-100",
  teal: "text-teal-400",
  amber: "text-amber-400",
  red: "text-red-400",
  green: "text-emerald-400",
};

export function MetricStrip({ items, className }: MetricStripProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(adminSurfaceVariants({ variant: "section" }), "px-4 py-4")}
        >
          <p className={adminCardLabelClass}>{item.label}</p>
          <div className={cn("mt-3 text-2xl font-semibold tracking-tight", toneClassNames[item.tone ?? "default"])}>
            {item.value}
          </div>
          {item.note && (
            <p className={cn("mt-2", adminCardBodyClass)}>{item.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
