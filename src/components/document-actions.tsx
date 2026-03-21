"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function downloadMarkdown(title: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-").toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

interface DocumentActionsProps {
  documentId: string;
  title: string;
  content: string;
}

export function DocumentActions({ documentId, title, content }: DocumentActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this document?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/document/${documentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/documents");
    } catch {
      setDeleting(false);
    }
  }, [documentId, router]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadMarkdown(title, content)}
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
    </>
  );
}
