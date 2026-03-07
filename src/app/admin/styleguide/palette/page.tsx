const coreTokens = [
  { name: "Background", token: "--background", color: "bg-zinc-950" },
  { name: "Foreground", token: "--foreground", color: "bg-zinc-100" },
  { name: "Accent", token: "--accent (teal)", color: "bg-teal-500" },
  { name: "Destructive", token: "--destructive", color: "bg-red-500" },
  { name: "Warning", token: "--warning", color: "bg-amber-400" },
  { name: "Success", token: "--success", color: "bg-emerald-500" },
];

const colorScales: Array<{
  name: string;
  token: string;
  steps: Array<{ step: number; cls: string }>;
}> = [
  {
    name: "Background",
    token: "--background",
    steps: [
      { step: 100, cls: "bg-zinc-100" },
      { step: 200, cls: "bg-zinc-200" },
      { step: 300, cls: "bg-zinc-300" },
      { step: 400, cls: "bg-zinc-400" },
      { step: 500, cls: "bg-zinc-500" },
      { step: 600, cls: "bg-zinc-600" },
      { step: 700, cls: "bg-zinc-700" },
      { step: 800, cls: "bg-zinc-800" },
      { step: 900, cls: "bg-zinc-900" },
    ],
  },
  {
    name: "Foreground",
    token: "--foreground",
    steps: [
      { step: 100, cls: "bg-zinc-100" },
      { step: 200, cls: "bg-zinc-200" },
      { step: 300, cls: "bg-zinc-300" },
      { step: 400, cls: "bg-zinc-400" },
      { step: 500, cls: "bg-zinc-500" },
      { step: 600, cls: "bg-zinc-600" },
      { step: 700, cls: "bg-zinc-700" },
      { step: 800, cls: "bg-zinc-800" },
      { step: 900, cls: "bg-zinc-900" },
    ],
  },
  {
    name: "Accent",
    token: "--accent",
    steps: [
      { step: 100, cls: "bg-teal-100" },
      { step: 200, cls: "bg-teal-200" },
      { step: 300, cls: "bg-teal-300" },
      { step: 400, cls: "bg-teal-400" },
      { step: 500, cls: "bg-teal-500" },
      { step: 600, cls: "bg-teal-600" },
      { step: 700, cls: "bg-teal-700" },
      { step: 800, cls: "bg-teal-800" },
      { step: 900, cls: "bg-teal-900" },
    ],
  },
  {
    name: "Destructive",
    token: "--destructive",
    steps: [
      { step: 100, cls: "bg-red-100" },
      { step: 200, cls: "bg-red-200" },
      { step: 300, cls: "bg-red-300" },
      { step: 400, cls: "bg-red-400" },
      { step: 500, cls: "bg-red-500" },
      { step: 600, cls: "bg-red-600" },
      { step: 700, cls: "bg-red-700" },
      { step: 800, cls: "bg-red-800" },
      { step: 900, cls: "bg-red-900" },
    ],
  },
  {
    name: "Warning",
    token: "--warning",
    steps: [
      { step: 100, cls: "bg-amber-100" },
      { step: 200, cls: "bg-amber-200" },
      { step: 300, cls: "bg-amber-300" },
      { step: 400, cls: "bg-amber-400" },
      { step: 500, cls: "bg-amber-500" },
      { step: 600, cls: "bg-amber-600" },
      { step: 700, cls: "bg-amber-700" },
      { step: 800, cls: "bg-amber-800" },
      { step: 900, cls: "bg-amber-900" },
    ],
  },
  {
    name: "Success",
    token: "--success",
    steps: [
      { step: 100, cls: "bg-emerald-100" },
      { step: 200, cls: "bg-emerald-200" },
      { step: 300, cls: "bg-emerald-300" },
      { step: 400, cls: "bg-emerald-400" },
      { step: 500, cls: "bg-emerald-500" },
      { step: 600, cls: "bg-emerald-600" },
      { step: 700, cls: "bg-emerald-700" },
      { step: 800, cls: "bg-emerald-800" },
      { step: 900, cls: "bg-emerald-900" },
    ],
  },
];

const scaleSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function PalettePage() {
  return (
    <div className="divide-y divide-zinc-700/50 [&>section]:py-10 [&>section:first-child]:pt-0">
      {/* Core Tokens */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">Core Tokens</h2>
        <div className="grid grid-cols-3 gap-4">
          {coreTokens.map((token) => (
            <div key={token.name} className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
              <div className={`h-24 ${token.color}`} />
              <div className="px-3 py-3">
                <p className="type-body-sm font-medium text-zinc-200">{token.name}</p>
                <p className="text-2xs font-mono text-zinc-500">{token.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9-Step Color Tokens */}
      <section>
        <h2 className="type-body font-medium text-zinc-100 mb-4">9-Step Color Tokens</h2>
        <div className="space-y-1">
          {/* Header row */}
          <div className="flex items-center gap-2">
            <div className="w-36 shrink-0">
              <span className="type-body-sm text-zinc-500">Token Scale</span>
            </div>
            <div className="flex-1 grid grid-cols-9 gap-2">
              {scaleSteps.map((step) => (
                <span key={step} className="text-2xs font-mono text-zinc-500 text-center">{step}</span>
              ))}
            </div>
          </div>

          {/* Color rows */}
          {colorScales.map((scale) => (
            <div key={scale.name} className="flex items-center gap-2 py-2">
              <div className="w-36 shrink-0">
                <p className="type-body-sm font-medium text-zinc-200">{scale.name}</p>
                <p className="text-2xs font-mono text-zinc-500">{scale.token}</p>
              </div>
              <div className="flex-1 grid grid-cols-9 gap-2">
                {scale.steps.map((s) => (
                  <div
                    key={s.step}
                    className={`h-10 rounded-md ${s.cls}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
