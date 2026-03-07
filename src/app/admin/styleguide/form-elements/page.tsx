import { CodeToken } from "@/components/admin/code-token";

const standards = [
  <>Inputs use <CodeToken>bg-zinc-900 border-zinc-800 rounded-lg text-sm</CodeToken></>,
  <>Focus state: <CodeToken>border-zinc-600 + ring-1 ring-teal-500/60</CodeToken></>,
  <>Error state: <CodeToken>border-red-400/50</CodeToken> with red helper text below</>,
  <>Disabled: <CodeToken>opacity-50</CodeToken> with <CodeToken>disabled</CodeToken> attribute</>,
  <>Labels use <CodeToken>type-body-sm text-zinc-400</CodeToken>, placed above the input</>,
  <>Placeholder text uses <CodeToken>placeholder-zinc-600</CodeToken></>,
];

export default function FormElementsPage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Text inputs */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Text Input</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="type-body-sm text-zinc-400 mb-1 block">Default</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-sm"
              placeholder="Placeholder text"
              readOnly
            />
          </div>
          <div>
            <label className="type-body-sm text-zinc-400 mb-1 block">Focus</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm ring-1 ring-teal-500/60"
              defaultValue="Focused state"
              readOnly
            />
          </div>
          <div>
            <label className="type-body-sm text-zinc-400 mb-1 block">Error</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-900 border border-red-400/50 rounded-lg text-zinc-100 text-sm"
              defaultValue="Invalid value"
              readOnly
            />
            <p className="text-sm text-red-400 mt-1">This field is required</p>
          </div>
          <div>
            <label className="type-body-sm text-zinc-400 mb-1 block">Disabled</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 text-sm opacity-50"
              placeholder="Disabled input"
              disabled
            />
          </div>
        </div>
      </section>

      {/* Textarea */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Textarea</h2>
        <div className="max-w-md">
          <textarea
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-teal-500/60 text-sm resize-y min-h-24"
            placeholder="Write something..."
            rows={3}
            readOnly
          />
        </div>
      </section>

      {/* Search */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Search</h2>
        <div className="max-w-md relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-teal-500/60 text-sm"
            placeholder="Search..."
            readOnly
          />
        </div>
      </section>

      {/* Standards */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Standards</h2>
        <ul className="space-y-2">
          {standards.map((rule, i) => (
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
