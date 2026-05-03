"use client";

import { cn } from "@/lib/utils";

interface RequestsPaginationProps {
  currentPage: number;
  totalPages: number;
  safeCurrentPage: number;
  totalRecords: number;
  processedCount: number;
  onPageChange: (page: number) => void;
}

export function RequestsPagination({
  currentPage,
  totalPages,
  safeCurrentPage,
  totalRecords,
  processedCount,
  onPageChange,
}: RequestsPaginationProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/30 px-6 py-4">
      <p className="text-xs font-medium text-[var(--muted)]">
        Showing <span className="text-[var(--text)]">{processedCount}</span> of <span className="text-[var(--text)]">{totalRecords}</span> requests
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={safeCurrentPage === 1}
          className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-semibold text-[var(--muted)] disabled:opacity-50 transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
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
                  "h-8 w-8 rounded-lg text-xs font-bold transition-all",
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
          className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-semibold text-[var(--muted)] disabled:opacity-50 transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        >
          Next
        </button>
      </div>
    </footer>
  );
}
