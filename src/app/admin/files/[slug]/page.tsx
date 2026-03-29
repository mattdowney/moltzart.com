import { notFound } from "next/navigation";
import { fetchDocumentBySlug } from "@/lib/db";
import { CategoryTag, AgentTag } from "@/components/admin/tag-badge";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { PageHeader } from "@/components/admin/page-header";
import { DocumentActions } from "@/components/document-actions";
import { formatShortDate } from "@/lib/date-format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DocumentDetailPage({ params }: Props) {
  const { slug } = await params;
  const doc = await fetchDocumentBySlug(slug);
  if (!doc) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={doc.title}
        breadcrumbs={[
          { label: "Files", href: "/admin/files" },
          { label: doc.title },
        ]}
        meta={
          <>
            {doc.category && <CategoryTag category={doc.category} />}
            {doc.agent && <AgentTag agent={doc.agent} />}
            <span className="type-body-sm text-zinc-600">
              {formatShortDate(doc.created_at)}
            </span>
          </>
        }
      >
        <DocumentActions
          documentId={doc.id}
          title={doc.title}
          content={doc.content}
        />
      </PageHeader>

      <MarkdownRenderer
        content={doc.content}
        className="doc-markdown-full-width"
        skipFirstH1
      />
    </div>
  );
}
