"use client";

import { Eye, FileText, Calendar, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/features/residents/utils";
import { StatusChip } from "./requests-table-view";
import type { Request } from "../types";

interface RequestsGridViewProps {
  requests: Request[];
  onView: (request: Request) => void;
}

export function RequestsGridView({
  requests,
  onView,
}: RequestsGridViewProps) {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {requests.map((req) => (
        <article 
          key={req.id}
          onClick={() => onView(req)}
          className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
        >
          <div className="mb-4 flex items-start justify-between">
            <StatusChip status={req.status} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono transition-opacity group-hover:opacity-0">{req.id}</span>
          </div>
          
          <h4 className="mb-1 text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{req.type}</h4>
          <p className="mb-4 text-[11px] text-[var(--muted)] line-clamp-2 min-h-[32px]">{req.purpose}</p>
          
          <div className="mt-auto space-y-3 pt-4 border-t border-[var(--border)]/50">
            <div className="flex items-center gap-2">
              <Avatar name={req.entityName} hideText className="h-6 w-6" />
              <span className="text-xs font-semibold text-[var(--text)] truncate">{req.entityName}</span>
            </div>
            
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDate(req.submittedAt)}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-[var(--primary)]" />
                {req.entityType}
              </div>
            </div>
          </div>
          
          <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 transition-transform active:scale-90">
              <Eye className="h-4 w-4" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
