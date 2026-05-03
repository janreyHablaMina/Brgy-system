"use client";

import { cn } from "@/lib/utils";

interface RequestsPaginationProps {
  currentPage: number;
  totalPages: number;
  safeCurrentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function RequestsPagination({
  currentPage,
  totalPages,
  safeCurrentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: RequestsPaginationProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Page <span className="text-[var(--text)]">{safeCurrentPage}</span> of {totalPages}
        </span>
        <div className="h-3 w-px bg-[var(--border)]" />
        <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Rows
          <select
            value={rowsPerPage}
            onChange={(event) => {
              onRowsPerPageChange(Number(event.target.value));
            }}
            className="h-7 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={safeCurrentPage === 1}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button 
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                  safeCurrentPage === pageNum 
                    ? "bg-[var(--primary)] text-white shadow-sm" 
                    : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && <span className="text-[var(--muted)]">...</span>}
        </div>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={safeCurrentPage === totalPages}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </footer>
  );
}
