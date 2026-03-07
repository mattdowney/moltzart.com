import { cn } from "@/lib/utils";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { adminCardLabelClass } from "@/components/admin/card-content";

interface ContextRailSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface ContextRailProps {
  sections: ContextRailSection[];
  sticky?: boolean;
  className?: string;
}

export function ContextRail({
  sections,
  sticky = true,
  className,
}: ContextRailProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <aside className={cn("min-w-0", sticky && "lg:sticky lg:top-6", className)}>
      <div className="space-y-4">
        {sections.map((section) => (
          <section
            key={section.id}
            className={cn(adminSurfaceVariants({ variant: "section" }), "p-4")}
          >
            <p className={adminCardLabelClass}>
              {section.title}
            </p>
            <div className="mt-2 space-y-2">{section.content}</div>
          </section>
        ))}
      </div>
    </aside>
  );
}
