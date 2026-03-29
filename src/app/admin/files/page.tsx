import { fetchDocumentsDb, fetchFilesDb } from "@/lib/db";
import { FilesView } from "@/components/files-view";

export const dynamic = "force-dynamic";

export default async function AdminFiles() {
  const [documents, files] = await Promise.all([
    fetchDocumentsDb(),
    fetchFilesDb(),
  ]);
  return <FilesView documents={documents} files={files} />;
}
