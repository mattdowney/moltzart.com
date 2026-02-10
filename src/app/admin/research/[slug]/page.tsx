"use client";

import { AdminShell, useAdminAuth } from "@/components/admin-shell";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function DocContent() {
  const { slug } = useParams<{ slug: string }>();
  const { password } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoc = useCallback(async () => {
    if (!password) return;
    try {
      const res = await fetch(`/api/research/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      }
    } catch {}
    setLoading(false);
  }, [password, slug]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/research"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        All Research
      </Link>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : (
        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-zinc-100 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-amber-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-table:text-sm prose-th:text-zinc-400 prose-th:font-medium prose-td:text-zinc-300 prose-hr:border-zinc-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}

export default function AdminResearchDoc() {
  return (
    <AdminShell title="Research">
      <DocContent />
    </AdminShell>
  );
}
