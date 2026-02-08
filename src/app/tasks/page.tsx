"use client";

import { useState, useEffect, useCallback } from "react";

export default function Tasks() {
  const [password, setPassword] = useState("");
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTasks = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.status === 401) {
        setError("Wrong password");
        setAuthed(false);
        sessionStorage.removeItem("tasks_pw");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load tasks");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMarkdown(data.markdown);
      setAuthed(true);
      setLastUpdated(new Date());
      sessionStorage.setItem("tasks_pw", pw);
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("tasks_pw");
    if (saved) {
      setPassword(saved);
      fetchTasks(saved);
    }
  }, [fetchTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) fetchTasks(password.trim());
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">🎹 Tasks</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "View Tasks"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">🎹 Tasks</h1>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-zinc-600 text-xs">
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => fetchTasks(password)}
              disabled={loading}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
            >
              {loading ? "↻" : "Refresh"}
            </button>
          </div>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 leading-relaxed">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
