"use client";

import { useState, useCallback } from "react";
import { FileText, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { SortableDataTable, type Column } from "@/components/admin/sortable-data-table";
import type { DbDocument } from "@/lib/db";

type DocumentSummary = Omit<DbDocument, "content">;

interface DocumentsViewProps {
  initialData: DocumentSummary[];
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const columns: Column<DocumentSummary>[] = [
  {
    key: "title",
    label: "Title",
    render: (doc) => (
      <span className="inline-flex items-center gap-2">
        <FileText className="size-4 text-zinc-500 shrink-0" />
        {doc.title}
      </span>
    ),
    sortValue: (doc) => doc.title,
  },
  {
    key: "created",
    label: "Created",
    render: (doc) => formatDateTime(doc.created_at),
    sortValue: (doc) => doc.created_at,
    hiddenOnMobile: true,
  },
];

export function DocumentsView({ initialData }: DocumentsViewProps) {
  const [documents, setDocuments] = useState(initialData);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm("Delete this document?")) return;

      setDeleting(id);
      try {
        const res = await fetch(`/api/admin/document/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      } catch {
        // Silently fail
      } finally {
        setDeleting(null);
      }
    },
    []
  );

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle={`${documents.length} document${documents.length !== 1 ? "s" : ""}`}
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Documents uploaded by agents will appear here."
        />
      ) : (
        <SortableDataTable
          columns={columns}
          rows={documents}
          rowHref={(doc) => `/admin/documents/${doc.slug || doc.id}`}
          rowKey={(doc) => doc.id}
          rowAction={(doc) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleDelete(doc.id, e)}
              disabled={deleting === doc.id}
              className="size-7 p-0 text-zinc-600 hover:text-red-400"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        />
      )}
    </>
  );
}
