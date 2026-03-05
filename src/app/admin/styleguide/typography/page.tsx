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
