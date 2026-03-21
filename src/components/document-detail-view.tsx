"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, ArrowLeft, Bot, Tag } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/admin/markdown-renderer";
import { adminSurfaceVariants } from "@/components/admin/surface";
import { cn } from "@/lib/utils";
import type { DbDocument } from "@/lib/db";

const categoryColors: Record<string, string> = {
  reports: "bg-blue-500/20 text-blue-400",
  analysis: "bg-violet-500/20 text-violet-400",
  research: "bg-cyan-500/20 text-cyan-400",
  logs: "bg-amber-500/20 text-amber-400",
  notes: "bg-green-500/20 text-green-400",
};

function CategoryBadge({ category }: { category: string }) {
  const colorClass =
    categoryColors[category.toLowerCase()] || "bg-zinc-700/40 text-zinc-400";
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
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

interface DocumentDetailViewProps {
  document: DbDocument;
}

export function DocumentDetailView({ document: doc }: DocumentDetailViewProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this document?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/document/${doc.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/documents");
    } catch {
      setDeleting(false);
    }
  }, [doc.id, router]);

  return (
    <>
      <PageHeader
        title={doc.title}
        breadcrumbs={[
          { label: "Documents", href: "/admin/documents" },
          { label: doc.title },
        ]}
        meta={
          <>
            {doc.category && <CategoryBadge category={doc.category} />}
            {doc.agent && <AgentBadge agent={doc.agent} />}
            <span className="type-body-sm text-zinc-500">
              {formatDate(doc.created_at)}
            </span>
          </>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/documents")}
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadMarkdown(doc.title, doc.content)}
        >
          <Download className="size-3.5" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-300 hover:border-red-800"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </PageHeader>

      <div className={cn(adminSurfaceVariants({ variant: "section" }), "p-6")}>
        <MarkdownRenderer content={doc.content} />
      </div>
    </>
  );
}
