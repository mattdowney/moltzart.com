import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/research-headings";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const el = node as { props: { children?: ReactNode } };
    return extractText(el.props.children);
  }
  return "";
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  generateIds?: boolean;
  skipFirstH1?: boolean;
}

export function MarkdownRenderer({
  content,
  className,
  generateIds,
  skipFirstH1,
}: MarkdownRendererProps) {
  let h1Count = 0;
  const components: Components = {
    ...(generateIds && {
      h2: ({ children }) => {
        const text = extractText(children);
        return <h2 id={slugify(text)}>{children}</h2>;
      },
    }),
    ...(skipFirstH1 && {
      h1: ({ children }) => {
        h1Count++;
        if (h1Count === 1) return null;
        return <h1>{children}</h1>;
      },
    }),
    table: ({ children }) => (
      <div className="not-prose my-6 rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-zinc-800/50 bg-zinc-800/40">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left text-xs font-medium text-zinc-400 px-4 py-2.5">{children}</th>
    ),
    td: ({ children }) => (
      <td className="text-left text-sm text-zinc-300 px-4 py-2.5">{children}</td>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-zinc-800/30 last:border-0">{children}</tr>
    ),
  };

  return (
    <article
      className={`prose prose-sm prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-sm prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-sm prose-li:text-zinc-300 prose-strong:text-zinc-100 prose-a:text-zinc-100 prose-a:underline prose-a:underline-offset-2 prose-a:transition-colors hover:prose-a:no-underline hover:prose-a:text-zinc-50 prose-code:text-amber-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-hr:border-zinc-800 [&_hr+p]:text-zinc-500${className ? ` ${className}` : ""}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
