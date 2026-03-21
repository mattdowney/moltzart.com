"use client";

import { useState, useCallback } from "react";
import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { cn } from "@/lib/utils";
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
        <div className={cn(adminSurfaceVariants({ variant: "section" }))}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="w-10 py-2.5 pl-4 pr-2 text-left">
                  <span className="sr-only">Type</span>
                </th>
                <th className="py-2.5 px-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Title
                </th>
                <th className="py-2.5 px-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hidden sm:table-cell">
                  Created
                </th>
                <th className="w-10 py-2.5 pl-2 pr-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-zinc-800/50 last:border-0 transition-colors hover:bg-zinc-800/30"
                >
                  <td className="py-2.5 pl-4 pr-2">
                    <FileText className="size-4 text-zinc-500" />
                  </td>
                  <td className="py-2.5 px-2">
                    <Link
                      href={`/admin/documents/${doc.slug || doc.id}`}
                      className="text-sm font-medium text-zinc-200 hover:text-white transition-colors"
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className="py-2.5 px-2 hidden sm:table-cell">
                    <span className="text-xs text-zinc-500">
                      {formatDateTime(doc.created_at)}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(doc.id, e)}
                      disabled={deleting === doc.id}
                      className="size-7 p-0 text-zinc-600 hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
