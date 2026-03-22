"use client";

import { type ReactNode, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue: (row: T) => string | number;
  /** Hide this column on screens below md breakpoint. */
  hiddenOnMobile?: boolean;
}

interface SortableDataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowHref?: (row: T) => string;
  rowKey?: (row: T, idx: number) => string | number;
  /** Extra content rendered after the last column cell (e.g. action buttons). */
  rowAction?: (row: T) => ReactNode;
}

const thBase = "text-left text-xs md:text-[11px] font-medium text-zinc-500 px-3 py-2.5 md:py-1.5 cursor-pointer select-none transition-colors hover:text-zinc-300";
const tdBase = "px-3 py-2.5 md:py-1.5";

export function SortableDataTable<T>({ columns, rows, rowHref, rowKey, rowAction }: SortableDataTableProps<T>) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(col: number) {
    if (sortCol === col) {
      setSortAsc((prev) => !prev);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }

  const sorted = useMemo(() => {
    if (sortCol === null) return rows;
    const col = columns[sortCol];
    return [...rows].sort((a, b) => {
      const av = col.sortValue(a);
      const bv = col.sortValue(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      const cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
      return sortAsc ? cmp : -cmp;
    });
  }, [rows, columns, sortCol, sortAsc]);

  function colClass(col: Column<T>) {
    return col.hiddenOnMobile ? "hidden md:table-cell" : "";
  }

  function renderCell(col: Column<T>, row: T, colIdx: number) {
    if (colIdx === 0) {
      return (
        <span className="text-xs font-medium text-zinc-100 group-hover:text-zinc-50">
          {col.render(row)}
        </span>
      );
    }
    return <span className="text-xs text-zinc-400">{col.render(row)}</span>;
  }

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-zinc-800/50 bg-zinc-800/40">
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={cn(thBase, colClass(col))}
                onClick={() => handleSort(i)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <span className="w-[10px] shrink-0">
                    {sortCol === i ? (
                      sortAsc ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                    ) : (
                      <ArrowUpDown size={10} className="opacity-0" />
                    )}
                  </span>
                </span>
              </th>
            ))}
            {rowAction && <th className="w-12" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, rowIdx) => {
            const key = rowKey ? rowKey(row, rowIdx) : rowIdx;

            if (rowHref) {
              return (
                <tr key={key} className="group border-b border-zinc-800/30 last:border-0 transition-colors hover:bg-zinc-800/40">
                  {columns.map((col, colIdx) => (
                    <td key={col.key} className={cn(tdBase, colClass(col))}>
                      <Link href={rowHref(row)} className="block">
                        {renderCell(col, row, colIdx)}
                      </Link>
                    </td>
                  ))}
                  {rowAction && (
                    <td className={tdBase}>{rowAction(row)}</td>
                  )}
                </tr>
              );
            }

            return (
              <tr key={key} className="group border-b border-zinc-800/30 last:border-0 transition-colors hover:bg-zinc-800/40">
                {columns.map((col, colIdx) => (
                  <td key={col.key} className={cn(tdBase, colClass(col))}>
                    {renderCell(col, row, colIdx)}
                  </td>
                ))}
                {rowAction && (
                  <td className={tdBase}>{rowAction(row)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
