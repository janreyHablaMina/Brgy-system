"use client";

import { Search, RotateCcw, ChevronDown, Calendar, Filter } from "lucide-react";
import type { RequestFilters } from "../types";
import { 
  DOCUMENT_TYPE_OPTIONS, 
  SOURCE_OPTIONS 
} from "../constants";

interface RequestsFiltersProps {
  filters: RequestFilters;
  setFilters: (filters: RequestFilters | ((prev: RequestFilters) => RequestFilters)) => void;
  activeFilterCount: number;
  onReset: () => void;
}

export function RequestsFilters({
  filters,
  setFilters,
  activeFilterCount,
  onReset,
}: RequestsFiltersProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-none">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">Search Records</span>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
            <input
              type="text"
              placeholder="ID, Name, Purpose..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card-soft)] pl-10 pr-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] transition-all"
            />
          </div>
        </label>

        <FilterSelect 
          label="Document Type" 
          value={filters.type} 
          options={DOCUMENT_TYPE_OPTIONS} 
          onChange={(v) => setFilters((prev) => ({ ...prev, type: v as any }))} 
        />

        <FilterSelect 
          label="Source" 
          value={filters.source} 
          options={SOURCE_OPTIONS} 
          onChange={(v) => setFilters((prev) => ({ ...prev, source: v as any }))} 
        />

        <DateFilter 
          label="From Date" 
          value={filters.dateFrom} 
          onChange={(v) => setFilters((prev) => ({ ...prev, dateFrom: v }))} 
        />
        <DateFilter 
          label="To Date" 
          value={filters.dateTo} 
          onChange={(v) => setFilters((prev) => ({ ...prev, dateTo: v }))} 
        />

        <button 
          onClick={onReset}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-[var(--primary)]/5 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all active:scale-95 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          Filters ({activeFilterCount} applied)
        </button>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">{label}</span>
      <div className="relative group/select">
        <select 
          value={value} 
          onChange={(event) => onChange(event.target.value)} 
          className="h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none transition-colors group-focus-within/select:text-[var(--primary)]" />
      </div>
    </label>
  );
}

function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">{label}</span>
      <div className="relative group/date">
        <input 
          type="date" 
          value={value} 
          onChange={(event) => onChange(event.target.value)} 
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
        />
        <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none transition-colors group-focus-within/date:text-[var(--primary)]" />
      </div>
    </label>
  );
}
