import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbListItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

type DividerTone = "none" | "soft" | "default";

interface AdminPageIntroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: DividerTone;
  className?: string;
}

const dividerClassNames: Record<DividerTone, string> = {
  none: "",
  soft: "border-zinc-800/50",
  default: "border-zinc-800",
};

export function AdminPageIntro({
  title,
  subtitle,
  breadcrumbs,
  meta,
  actions,
  divider = "default",
  className,
}: AdminPageIntroProps) {
  const dividerClassName = dividerClassNames[divider];

  return (
    <div className={cn("flow-root space-y-5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={cn("pb-4", divider !== "none" && `border-b ${dividerClassName}`)}>
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-zinc-500">
              {breadcrumbs.map((item, i) => (
                <Fragment key={`${item.label}-${i}`}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbListItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbListItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
          divider !== "none" && `border-b pb-4 mb-2 ${dividerClassName}`
        )}
      >
        <div className="min-w-0 max-w-3xl space-y-3">
          <div className="space-y-2">
            <h1 className="type-h1 text-zinc-100">{title}</h1>
            {subtitle && (
              <p className="type-body text-zinc-400">{subtitle}</p>
            )}
          </div>
          {meta && (
            <div className="flex flex-wrap items-center gap-2 text-zinc-500">
              {meta}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
