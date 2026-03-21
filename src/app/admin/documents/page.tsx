import { fetchDocumentsDb } from "@/lib/db";
import { DocumentsView } from "@/components/documents-view";

export const dynamic = "force-dynamic";

export default async function AdminDocuments() {
  const documents = await fetchDocumentsDb();
  return <DocumentsView initialData={documents} />;
}
