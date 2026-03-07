import { AdminPageIntro } from "@/components/admin/admin-page-intro";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, children }: PageHeaderProps) {
  return (
    <AdminPageIntro
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={children}
    />
  );
}
