import { FileText, Folder, Bell, CheckCircle, AlertTriangle } from "lucide-react";

const spacingScale = [
  { util: "gap-1 / space-y-1", value: "4px", usage: "Tight inline spacing" },
  { util: "gap-1.5 / space-y-1.5", value: "6px", usage: "Tight list items" },
  { util: "gap-2 / space-y-2", value: "8px", usage: "Icon + text, standard list items" },
  { util: "gap-2.5", value: "10px", usage: "Input internal spacing" },
  { util: "gap-3 / space-y-3", value: "12px", usage: "Card stacks, button groups" },
  { util: "gap-4 / space-y-4", value: "16px", usage: "Section group spacing" },
  { util: "gap-6 / space-y-6", value: "24px", usage: "Major section spacing" },
];

const radiusVariants = [
  { token: "rounded-sm", value: "6px" },
  { token: "rounded-md", value: "8px" },
  { token: "rounded-lg", value: "10px" },
  { token: "rounded-xl", value: "14px" },
  { token: "rounded-2xl", value: "18px" },
  { token: "rounded-3xl", value: "22px" },
  { token: "rounded-4xl", value: "26px" },
];

const iconSizes = [
  { size: 12, usage: "Chevrons, meta", Icon: CheckCircle },
  { size: 14, usage: "Status, inline", Icon: AlertTriangle },
  { size: 16, usage: "Default section", Icon: FileText },
  { size: 18, usage: "Emphasis", Icon: Folder },
  { size: 32, usage: "EmptyState", Icon: Bell },
];

export default function SpacingPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Scale */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Scale</h2>
        <div className="space-y-2">
          {spacingScale.map((s) => (
            <div key={s.util} className="flex items-center gap-4">
              <div className="w-16 flex justify-end">
                <div className="bg-teal-400/30 h-3 rounded" style={{ width: s.value }} />
              </div>
              <span className="text-2xs font-mono text-zinc-400 w-44 shrink-0">{s.util}</span>
              <span className="type-body-sm text-zinc-500 w-12 shrink-0">{s.value}</span>
              <span className="type-body-sm text-zinc-500">{s.usage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Border radius */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Border Radius</h2>
        <div className="flex items-end gap-3 flex-wrap">
          {radiusVariants.map((r) => (
            <div key={r.token} className="text-center">
              <div className={`w-14 h-14 border border-zinc-500 bg-zinc-800/40 ${r.token}`} />
              <p className="text-2xs font-mono text-zinc-400 mt-2">{r.token}</p>
              <p className="type-body-sm text-zinc-600">{r.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Icon sizes */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Icon Sizes</h2>
        <div className="flex items-end gap-6">
          {iconSizes.map((item) => (
            <div key={item.size} className="text-center">
              <item.Icon size={item.size} className="text-zinc-400 mx-auto" />
              <p className="text-2xs font-mono text-zinc-400 mt-2">{item.size}px</p>
              <p className="type-body-sm text-zinc-500 mt-1 max-w-20">{item.usage}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
