"use client";

import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import type { RequestStatus } from "../types";

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onUpdateStatus: (status: RequestStatus) => void;
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onUpdateStatus,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 px-2 border-r border-[var(--border)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] hover:bg-[var(--card)] transition">
          <UserPlus className="h-3.5 w-3.5" />
          Assign
        </button>
        <button 
          onClick={() => onUpdateStatus("Approved")}
          className="flex h-9 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve
        </button>
        <button 
          onClick={() => onUpdateStatus("Rejected")}
          className="flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition"
        >
          <XCircle className="h-3.5 w-3.5" />
          Reject
        </button>
        <button 
          onClick={onClear} 
          className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
