import { fetchDocumentBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import { DocumentDetailView } from "@/components/document-detail-view";

export const dynamic = "force-dynamic";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await fetchDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  return <DocumentDetailView document={doc} />;
}
