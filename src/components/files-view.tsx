"use client";

import { useState, useCallback, useRef } from "react";
import { FileText, Trash2, Upload, Download, File, X } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { SortableDataTable, type Column } from "@/components/admin/sortable-data-table";
import type { DbFile } from "@/lib/db";

interface FilesViewProps {
  documents: { id: string; title: string; slug: string | null; category: string | null; agent: string | null; created_at: string; updated_at: string }[];
  files: DbFile[];
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

type DocumentSummary = FilesViewProps["documents"][number];

const documentColumns: Column<DocumentSummary>[] = [
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
  },
];

const fileColumns: Column<DbFile>[] = [
  {
    key: "filename",
    label: "Name",
    render: (file) => (
      <span className="inline-flex items-center gap-2">
        <File className="size-4 text-zinc-500 shrink-0" />
        {file.filename}
      </span>
    ),
    sortValue: (file) => file.filename,
  },
  {
    key: "size",
    label: "Size",
    render: (file) => formatFileSize(file.size),
    sortValue: (file) => String(file.size).padStart(15, "0"),
  },
  {
    key: "uploader",
    label: "From",
    render: (file) => file.uploader || "—",
    sortValue: (file) => file.uploader || "",
  },
  {
    key: "created",
    label: "Uploaded",
    render: (file) => formatDateTime(file.created_at),
    sortValue: (file) => file.created_at,
  },
];

export function FilesView({ documents, files: initialFiles }: FilesViewProps) {
  const [files, setFiles] = useState(initialFiles);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState(documents);

  const handleDeleteDoc = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm("Delete this document?")) return;
      setDeletingDoc(id);
      try {
        const res = await fetch(`/api/admin/document/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setDocs((prev) => prev.filter((d) => d.id !== id));
      } catch {
        // silently fail
      } finally {
        setDeletingDoc(null);
      }
    },
    []
  );

  const handleDeleteFile = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm("Delete this file?")) return;
      setDeletingFile(id);
      try {
        const res = await fetch(`/api/admin/file/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } catch {
        // silently fail
      } finally {
        setDeletingFile(null);
      }
    },
    []
  );

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/file", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Upload failed: ${err.error || res.statusText}`);
          continue;
        }
        const data = await res.json();
        setFiles((prev) => [data.file, ...prev]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const totalCount = docs.length + files.length;

  return (
    <>
      <PageHeader
        title="Files"
        subtitle={`${totalCount} item${totalCount !== 1 ? "s" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="size-3.5" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </PageHeader>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed transition-colors p-6 text-center ${
          dragOver
            ? "border-blue-500 bg-blue-500/5"
            : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <Upload className="size-6" />
          <p className="type-body-sm">
            {uploading ? "Uploading..." : "Drop files here or click Upload"}
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h2 className="type-heading-sm text-zinc-300">Uploads</h2>
          <SortableDataTable
            columns={fileColumns}
            rows={files}
            rowKey={(f) => f.id}
            rowAction={(file) => (
              <div className="flex items-center gap-1">
                <a
                  href={file.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0 text-zinc-600 hover:text-zinc-300"
                  >
                    <Download className="size-3.5" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteFile(file.id, e)}
                  disabled={deletingFile === file.id}
                  className="size-7 p-0 text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          />
        </div>
      )}

      {/* Documents (existing) */}
      {docs.length > 0 && (
        <div className="space-y-3">
          <h2 className="type-heading-sm text-zinc-300">Documents</h2>
          <SortableDataTable
            columns={documentColumns}
            rows={docs}
            rowHref={(doc) => `/admin/files/${doc.slug || doc.id}`}
            rowKey={(doc) => doc.id}
            rowAction={(doc) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDeleteDoc(doc.id, e)}
                disabled={deletingDoc === doc.id}
                className="size-7 p-0 text-zinc-600 hover:text-red-400"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          />
        </div>
      )}

      {totalCount === 0 && (
        <EmptyState
          icon={FileText}
          title="No files yet"
          description="Upload files or create documents to get started."
        />
      )}
    </>
  );
}
