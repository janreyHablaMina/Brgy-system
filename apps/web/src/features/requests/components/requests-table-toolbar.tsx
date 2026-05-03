"use client";

import { 
  ChevronDown, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  Trash2, 
  ClipboardList, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type { RequestFilters } from "../types";

interface RequestsTableToolbarProps {
  totalRecords: number;
  activeFilterItems: { id: keyof RequestFilters; label: string }[];
  onRemoveFilter: (id: keyof RequestFilters) => void;
  onResetFilters: () => void;
  onExport: (scope: "all" | "filtered" | "selected", format: "csv" | "excel") => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
}

export function RequestsTableToolbar({
  totalRecords,
  activeFilterItems,
  onRemoveFilter,
  onResetFilters,
  onExport,
  viewMode,
  setViewMode,
}: RequestsTableToolbarProps) {
  return (
    <div className="relative z-20 flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--card)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--muted)] border-r border-[var(--border)] pr-4">
          <ClipboardList className="h-4 w-4 text-[var(--primary)]" />
          <span>Total Records</span>
          <span className="text-[var(--primary)] ml-1 font-extrabold">
            {totalRecords}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--text)]">Active Filters:</span>
          {activeFilterItems.length === 0 ? (
            <span className="text-[12px] text-[var(--muted)]">None</span>
          ) : (
            <>
              {activeFilterItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/[0.1]"
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={() => onRemoveFilter(item.id)}
                    className="rounded-sm p-0.5 transition-colors hover:bg-[var(--primary)]/20 hover:text-[var(--primary)]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={onResetFilters}
                className="ml-2 text-[12px] font-semibold text-[var(--primary)] hover:text-[var(--primary)]/80"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Bulk Actions Dropdown */}
        <DropdownMenu
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-[12px] font-semibold text-[var(--text)] transition-all hover:bg-[var(--card-soft)]"
          trigger={
            <>
              <Layers className="h-4 w-4 opacity-50" />
              Bulk Actions
              <ChevronDown className="h-3.5 w-3.5 opacity-40 ml-1" />
            </>
          }
          items={[
            { label: "Approve Selected", onClick: () => {}, icon: Layers },
            { label: "Reject Selected", onClick: () => {}, icon: Trash2, className: "text-rose-500" },
          ]}
        />

        {/* Export Report */}
        <DropdownMenu
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-[12px] font-semibold text-[var(--text)] transition-all hover:bg-[var(--card-soft)]"
          trigger={
            <>
              <Download className="h-4 w-4 opacity-50" />
              Export Report
            </>
          }
          items={[
            { 
              label: "Download as CSV", 
              onClick: () => onExport("all", "csv"), 
              icon: FileText,
            },
            { 
              label: "Download as Excel", 
              onClick: () => onExport("filtered", "excel"), 
              icon: FileSpreadsheet,
            },
          ]}
        />

        {/* View Toggles */}
        <div className="flex items-center gap-1 border-l border-[var(--border)] pl-3">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-all",
              viewMode === "table"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-soft)] hover:text-[var(--text)]"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-all",
              viewMode === "grid"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-soft)] hover:text-[var(--text)]"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
