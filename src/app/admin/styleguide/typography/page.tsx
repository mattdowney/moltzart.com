const typeClasses = [
  { cls: "type-h1", usage: "Page headings" },
  { cls: "type-h2", usage: "Section headings" },
  { cls: "type-h3", usage: "Sub-section headings" },
  { cls: "type-body", usage: "Standard body text" },
  { cls: "type-body-sm", usage: "Secondary/meta text" },
  { cls: "type-label", usage: "Section labels" },
  { cls: "type-badge", usage: "Tag badges" },
];

export default function TypographyPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Type classes */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">.type-* Classes</h2>
        <div className="space-y-4">
          {typeClasses.map((t) => (
            <div key={t.cls} className="space-y-1">
              <span className={`${t.cls} text-zinc-200`}>
                {t.cls === "type-badge" ? "TAG BADGE" : "The quick brown fox"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xs font-mono text-teal-400">.{t.cls}</span>
                <span className="type-body-sm text-zinc-500">{t.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Font families */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Font Families</h2>
        <div className="space-y-4">
          <div>
            <p className="type-body text-zinc-200 font-sans">Geist Sans — The quick brown fox jumps over the lazy dog</p>
            <p className="text-2xs font-mono text-zinc-500 mt-1">font-sans (default body)</p>
          </div>
          <div>
            <p className="type-body text-zinc-200 font-mono">Geist Mono — The quick brown fox jumps over the lazy dog</p>
            <p className="text-2xs font-mono text-zinc-500 mt-1">font-mono (code, badges, tokens)</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Card Copy Hierarchy</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4">
            <p className="type-body font-medium text-zinc-100">Card title uses `.type-body`</p>
            <p className="mt-2 type-body-sm text-zinc-500">
              All non-title card copy uses <span className="text-2xs font-mono text-teal-400">.type-body-sm</span>.
              Card copy also shares one leading system: titles use a tighter line box, and all support/meta copy shares the same smaller leading.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/60">
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Token</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Use</th>
                </tr>
              </thead>
              <tbody className="text-xs text-zinc-300">
                <tr className="border-b border-zinc-800/30">
                  <td className="px-4 py-2">Card title</td>
                  <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">type-body</span></td>
                  <td className="px-4 py-2 text-zinc-500">Primary readable label inside cards and headers</td>
                </tr>
                <tr className="border-b border-zinc-800/30">
                  <td className="px-4 py-2">Support copy</td>
                  <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">type-body-sm</span></td>
                  <td className="px-4 py-2 text-zinc-500">Descriptions, metadata, counts, helper text</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Section chrome</td>
                  <td className="px-4 py-2"><span className="text-2xs font-mono text-teal-400">type-label / text-2xs</span></td>
                  <td className="px-4 py-2 text-zinc-500">Eyebrows, small rail labels, structural markers only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Markdown variants */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Markdown Variants</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xs font-mono text-teal-400">.doc-markdown</span>
            <span className="type-body-sm text-zinc-500">Full prose treatment for long-form reading</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xs font-mono text-teal-400">.doc-markdown-compact</span>
            <span className="type-body-sm text-zinc-500">Tighter spacing for card contexts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xs font-mono text-teal-400">.doc-markdown-subtle</span>
            <span className="type-body-sm text-zinc-500">Muted body text (zinc-400)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
