"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Brain,
  Calendar,
  FileText,
  Settings,
  User,
  ListTodo,
  Sparkles,
  ChevronRight,
  X,
  Folder,
} from "lucide-react";
import type { BrainFile } from "@/lib/github";

const CATEGORIES = [
  { id: "all", label: "All", icon: Brain },
  { id: "identity", label: "Identity", icon: User },
  { id: "memory", label: "Memory", icon: Sparkles },
  { id: "daily-logs", label: "Daily Logs", icon: Calendar },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "research", label: "Research", icon: FileText },
  { id: "content", label: "Content", icon: FileText },
  { id: "config", label: "Config", icon: Settings },
] as const;

function highlightMatches(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="bg-amber-500/30 text-amber-200 rounded-sm px-0.5">$1</mark>'
  );
}

function getSearchSnippet(content: string, query: string): string | null {
  if (!query || !content) return null;
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - 80);
  const end = Math.min(content.length, idx + query.length + 80);
  let snippet = content.slice(start, end).replace(/\n/g, " ");
  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";
  return snippet;
}

export function BrainView() {
  const [files, setFiles] = useState<BrainFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadedContents, setLoadedContents] = useState<Record<string, string>>({});

  // Load file list
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);

        // Load all file contents for search
        const contents: Record<string, string> = {};
        await Promise.all(
          data.files.map(async (f: BrainFile) => {
            const contentRes = await fetch("/api/brain", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "content", path: f.path }),
            });
            if (contentRes.ok) {
              const d = await contentRes.json();
              contents[f.path] = d.content;
            }
          })
        );
        setLoadedContents(contents);
      }
      setLoading(false);
    })();
  }, []);

  // Load selected file content
  const loadContent = useCallback(
    async (path: string) => {
      if (loadedContents[path]) {
        setFileContent(loadedContents[path]);
        setSelectedFile(path);
        return;
      }
      setSelectedFile(path);
      setLoadingContent(true);
      const res = await fetch("/api/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "content", path }),
      });
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content);
        setLoadedContents((prev) => ({ ...prev, [path]: data.content }));
      }
      setLoadingContent(false);
    },
    [loadedContents]
  );

  // Filter + search
  const filtered = useMemo(() => {
    let result = files;
    if (activeCategory !== "all") {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((f) => {
        const nameMatch = f.name.toLowerCase().includes(q);
        const pathMatch = f.path.toLowerCase().includes(q);
        const contentMatch = loadedContents[f.path]
          ?.toLowerCase()
          .includes(q);
        return nameMatch || pathMatch || contentMatch;
      });
    }
    return result;
  }, [files, activeCategory, search, loadedContents]);

  // Stats
  const stats = useMemo(() => {
    const cats: Record<string, number> = {};
    for (const f of files) {
      cats[f.category] = (cats[f.category] || 0) + 1;
    }
    return cats;
  }, [files]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Brain size={20} /> Brain
        </h1>
        <div className="text-sm text-zinc-500">Loading your second brain…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Brain size={20} /> Brain
        </h1>
        <span className="text-xs text-zinc-500">
          {files.length} files · {Object.keys(loadedContents).length} indexed
        </span>
      </div>

      {/* Global search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          placeholder="Search everything… (⌘K)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === "all" ? files.length : stats[cat.id] || 0;
          if (count === 0 && cat.id !== "all") return null;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                  : "bg-zinc-900/30 text-zinc-500 border border-zinc-800/50 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <cat.icon size={12} />
              {cat.label}
              <span
                className={`ml-1 ${active ? "text-zinc-400" : "text-zinc-600"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* File list / detail split */}
      {selectedFile && fileContent !== null ? (
        <div className="space-y-4">
          {/* Back button + file path */}
          <button
            onClick={() => {
              setSelectedFile(null);
              setFileContent(null);
            }}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to files
          </button>
          <div className="flex items-center gap-2">
            <Folder size={14} className="text-zinc-600" />
            <span className="text-xs text-zinc-500 font-mono">{selectedFile}</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-200">
            {files.find((f) => f.path === selectedFile)?.name || selectedFile}
          </h2>

          {/* Rendered markdown content */}
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-6 overflow-auto max-h-[70vh]">
            {loadingContent ? (
              <div className="text-sm text-zinc-500">Loading…</div>
            ) : (
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {search
                  ? fileContent.split("\n").map((line, i) => (
                      <span
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(
                            line.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                            search
                          ) + "\n",
                        }}
                      />
                    ))
                  : fileContent}
              </pre>
            )}
          </div>
        </div>
      ) : (
        /* File list */
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <div className="text-sm text-zinc-500 py-8 text-center">
              {search
                ? `No results for "${search}"`
                : "No files in this category"}
            </div>
          ) : (
            filtered.map((file) => {
              const snippet = search
                ? getSearchSnippet(loadedContents[file.path] || "", search)
                : null;
              return (
                <button
                  key={file.path}
                  onClick={() => loadContent(file.path)}
                  className="w-full text-left flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/60 transition-colors group"
                >
                  <FileText
                    size={14}
                    className="text-zinc-600 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {file.path}
                      </span>
                    </div>
                    {snippet && (
                      <p
                        className="text-xs text-zinc-500 mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(
                            snippet
                              .replace(/</g, "&lt;")
                              .replace(/>/g, "&gt;"),
                            search
                          ),
                        }}
                      />
                    )}
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-zinc-700 shrink-0 mt-0.5 group-hover:text-zinc-500 transition-colors"
                  />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
