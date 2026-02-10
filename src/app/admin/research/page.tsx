"use client";

import { AdminShell, useAdminAuth } from "@/components/admin-shell";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

interface Doc {
  slug: string;
  title: string;
}

function ResearchContent() {
  const { password } = useAdminAuth();
  const [docs, setDocs] = useState<Doc[]>([]);

  const fetchDocs = useCallback(async () => {
    if (!password) return;
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setDocs(data.docs);
      }
    } catch {}
  }, [password]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight mb-6">Research</h1>
      <div className="space-y-2">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/admin/research/${doc.slug}`}
            className="flex items-center gap-3 px-4 py-3 border border-zinc-800/50 rounded-lg bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors group"
          >
            <FileText size={16} className="text-zinc-500 shrink-0" />
            <span className="text-sm text-zinc-200 flex-1">{doc.title}</span>
            <ArrowRight
              size={14}
              className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminResearch() {
  return (
    <AdminShell title="Research">
      <ResearchContent />
    </AdminShell>
  );
}
