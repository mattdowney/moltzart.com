import type { LucideIcon } from "lucide-react";
import { Panel } from "@/components/admin/panel";

interface AuthShellProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthShell({
  icon: Icon,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 sm:p-8">
      <Panel className="w-full max-w-sm p-5">
        <div className="flex items-start gap-3 border-b border-zinc-800/40 pb-4">
          <div className="rounded-lg border border-zinc-800/70 bg-zinc-900/40 p-2 text-zinc-500">
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <h1 className="type-h3 text-zinc-100">{title}</h1>
            {subtitle && <p className="type-body-sm text-zinc-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </Panel>
    </div>
  );
}
