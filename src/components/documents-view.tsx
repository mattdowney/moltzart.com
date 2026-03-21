"use client";

import { useState, useCallback } from "react";
import { FileText, Download, Trash2, ArrowLeft, Bot, Tag } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { adminSurfaceVariants } from "@/components/admin/surface";
import {
  adminCardTitleClass,
  adminCardMetaClass,
} from "@/components/admin/card-content";
import { cn } from "@/lib/utils";
import type { DbDocument } from "@/lib/db";

type DocumentSummary = Omit<DbDocument, "content">;

interface DocumentsViewProps {
  initialData: DocumentSummary[];
}

const categoryColors: Record<string, string> = {
  reports: "bg-blue-500/20 text-blue-400",
  analysis: "bg-violet-500/20 text-violet-400",
  research: "bg-cyan-500/20 text-cyan-400",
  logs: "bg-amber-500/20 text-amber-400",
  notes: "bg-green-500/20 text-green-400",
};

function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category.toLowerCase()] || "bg-zinc-700/40 text-zinc-400";
  return (
    <Badge className={colorClass}>
      <Tag className="size-2.5" />
      {category}
    </Badge>
  );
}

function AgentBadge({ agent }: { agent: string }) {
  return (
    <Badge className="bg-purple-500/20 text-purple-400">
      <Bot className="size-2.5" />
      {agent}
    </Badge>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function downloadMarkdown(title: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DocumentsView({ initialData }: DocumentsViewProps) {
  const [documents, setDocuments] = useState(initialData);
  const [selectedDoc, setSelectedDoc] = useState<DbDocument | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openDocument = useCallback(async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/document/${id}`);
      if (!res.ok) throw new Error("Failed to fetch document");
      const doc = await res.json();
      setSelectedDoc(doc);
    } catch {
      // Stay on list view on error
    } finally {
      setLoading(null);
    }
  }, []);

  const handleDelete = useCallback(async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Delete this document?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/document/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDoc?.id === id) setSelectedDoc(null);
    } catch {
      // Silently fail
    } finally {
      setDeleting(null);
    }
  }, [selectedDoc]);

  if (selectedDoc) {
    return (
      <>
        <PageHeader
          title={selectedDoc.title}
          breadcrumbs={[
            { label: "Documents", href: "/admin/documents" },
            { label: selectedDoc.title },
          ]}
          meta={
            <>
              {selectedDoc.category && <CategoryBadge category={selectedDoc.category} />}
              {selectedDoc.agent && <AgentBadge agent={selectedDoc.agent} />}
              <span className="type-body-sm text-zinc-500">
                {formatDate(selectedDoc.created_at)}
              </span>
            </>
          }
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDoc(null)}
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadMarkdown(selectedDoc.title, selectedDoc.content)}
          >
            <Download className="size-3.5" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(selectedDoc.id)}
            disabled={deleting === selectedDoc.id}
            className="text-red-400 hover:text-red-300 hover:border-red-800"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </PageHeader>

        <div className={cn(adminSurfaceVariants({ variant: "section" }), "p-6")}>
          <MarkdownRenderer content={selectedDoc.content} />
        </div>
      </>
    );
  }

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
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => openDocument(doc.id)}
              disabled={loading === doc.id}
              className={cn(
                adminSurfaceVariants({ variant: "section" }),
                "w-full text-left px-4 py-3 transition-colors hover:bg-zinc-800/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700",
                loading === doc.id && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 shrink-0 text-zinc-500" />
                    <span className={adminCardTitleClass}>{doc.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {doc.category && <CategoryBadge category={doc.category} />}
                    {doc.agent && <AgentBadge agent={doc.agent} />}
                    <span className={adminCardMetaClass}>{formatDate(doc.created_at)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(doc.id, e)}
                  disabled={deleting === doc.id}
                  className="shrink-0 text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
