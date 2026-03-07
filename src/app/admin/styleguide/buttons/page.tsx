import { Plus, Trash2, Download, Settings, ArrowRight, Loader2 } from "lucide-react";
import { CodeToken } from "@/components/admin/code-token";
import { Button } from "@/components/ui/button";

const variants = [
  { variant: "default", label: "Default" },
  { variant: "secondary", label: "Secondary" },
  { variant: "outline", label: "Outline" },
  { variant: "ghost", label: "Ghost" },
  { variant: "destructive", label: "Destructive" },
  { variant: "link", label: "Link" },
] as const;

const sizes = [
  { size: "xs", label: "Extra Small" },
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const;

const iconSpecs = [
  { context: "xs button", icon: "12px", gap: "6px", note: "Dense utility actions only." },
  { context: "sm button", icon: "14px", gap: "6px", note: "Default admin action size." },
  { context: "default / lg button", icon: "14px", gap: "6px", note: "Do not scale icons up with the button." },
  { context: "maximum", icon: "14px", gap: "8px", note: "If you need more than this, the control is oversized." },
] as const;

export default function ButtonsPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Variants */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Variants</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {variants.map((v) => (
            <Button key={v.variant} variant={v.variant} size="sm">{v.label}</Button>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Sizes</h2>
        <div className="flex items-end gap-3 flex-wrap">
          {sizes.map((s) => (
            <Button key={s.size} variant="outline" size={s.size}>{s.label}</Button>
          ))}
        </div>
      </section>

      {/* With icons */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">With Icons</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button size="sm"><Plus /> Create</Button>
            <Button size="sm" variant="destructive"><Trash2 /> Delete</Button>
            <Button size="sm" variant="outline"><Download /> Export</Button>
            <Button size="sm" variant="ghost"><Settings /> Settings</Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button size="sm" variant="outline">Next <ArrowRight /></Button>
            <Button size="sm" disabled><Loader2 className="animate-spin" /> Saving</Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button size="icon-xs" variant="ghost"><Plus /></Button>
            <Button size="icon-sm" variant="ghost"><Settings /></Button>
            <Button size="icon" variant="outline"><Download /></Button>
            <Button size="icon-lg" variant="outline"><Settings /></Button>
          </div>
          <p className="type-body-sm text-zinc-500">
            Icon-only buttons use <CodeToken>size=&quot;icon-*&quot;</CodeToken> variants.
          </p>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Icon Rules</h2>
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Context</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Icon</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Gap</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Rule</th>
              </tr>
            </thead>
            <tbody className="text-xs text-zinc-300">
              {iconSpecs.map((spec) => (
                <tr key={spec.context} className="border-b border-zinc-800/30 last:border-0">
                  <td className="px-4 py-2">{spec.context}</td>
                  <td className="px-4 py-2 font-mono text-zinc-400">{spec.icon}</td>
                  <td className="px-4 py-2 font-mono text-zinc-400">{spec.gap}</td>
                  <td className="px-4 py-2 text-zinc-500">{spec.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 space-y-2">
          {[
            <>Default icon size is <CodeToken>14px</CodeToken>. Small utility buttons may drop to <CodeToken>12px</CodeToken>.</>,
            <>Never exceed <CodeToken>14px</CodeToken> for inline button icons in the admin UI.</>,
            <>Default icon-to-label spacing is <CodeToken>6px</CodeToken>. Never exceed <CodeToken>8px</CodeToken>.</>,
            "Icons should support the label, not become the focal point of the control.",
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2 type-body-sm text-zinc-400">
              <span className="text-zinc-600 shrink-0">&bull;</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* States */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">States</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm">Normal</Button>
          <Button size="sm" disabled>Disabled</Button>
          <Button size="sm" disabled><Loader2 className="animate-spin" /> Loading</Button>
        </div>
        <p className="type-body-sm text-zinc-500 mt-3">
          All buttons include <CodeToken>active:scale-[0.98]</CodeToken> for press feedback.
        </p>
      </section>

      {/* Usage rules */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Usage Rules</h2>
        <ul className="space-y-2">
          {[
            "Default for primary actions, secondary for supporting actions",
            "Outline for neutral actions, ghost for tertiary/toolbar actions",
            "Destructive only for irreversible operations",
            "Prefer size sm for in-panel actions, default for page-level",
            "Leading icon for action type, trailing icon for direction",
            "Use 12-14px icons with 6px gap; 14px / 8px is the hard ceiling",
            "Loading state: disabled + spinner icon + label change",
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2 type-body-sm text-zinc-400">
              <span className="text-zinc-600 shrink-0">&bull;</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
