"use client";

import { 
  ArrowUpDown, 
  Eye, 
  MoreVertical, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  FileCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/features/residents/utils";
import type { 
  Request, 
  RequestStatus 
} from "../types";

interface SortThProps {
  label: string;
  active: boolean;
  onSort: () => void;
}

function SortTh({ label, active, onSort }: SortThProps) {
  return (
    <th className="px-4 py-3 text-left">
      <button 
        onClick={onSort} 
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
          active ? "text-[var(--primary)]" : "text-[var(--primary)] hover:text-[var(--primary)]"
        )}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3 transition-opacity", active ? "opacity-100" : "opacity-0")} />
      </button>
    </th>
  );
}

interface RequestsTableViewProps {
  requests: Request[];
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  sortBy: keyof Request;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Request) => void;
  onView: (request: Request) => void;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
}

export function RequestsTableView({
  requests,
  selectedIds,
  allVisibleSelected,
  onToggleSelectAll,
  onToggleSelectRow,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onUpdateStatus,
}: RequestsTableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
            <th className="px-4 py-3 text-center w-12">
              <input 
                type="checkbox" 
                checked={allVisibleSelected}
                onChange={onToggleSelectAll}
                className="rounded border-[var(--border)] accent-[var(--primary)] focus:ring-[var(--primary)]/20"
              />
            </th>
            <SortTh label="Request ID" onSort={() => onSort("id")} active={sortBy === "id"} />
            <SortTh label="Document Type" onSort={() => onSort("type")} active={sortBy === "type"} />
            <SortTh label="Requestor" onSort={() => onSort("entityName")} active={sortBy === "entityName"} />
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Purpose</th>
            <SortTh label="Submitted" onSort={() => onSort("submittedAt")} active={sortBy === "submittedAt"} />
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Status</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/40">
          {requests.map((req) => (
            <tr 
              key={req.id} 
              className={cn(
                "group relative transition-all hover:bg-[var(--primary)]/[0.02]",
                selectedIds.has(req.id) && "bg-[var(--primary)]/[0.04]"
              )}
            >
              <td className="relative px-4 py-3.5 text-center">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                />
                <input 
                  type="checkbox" 
                  checked={selectedIds.has(req.id)}
                  onChange={() => onToggleSelectRow(req.id)}
                  className="rounded border-[var(--border)] accent-[var(--primary)] focus:ring-[var(--primary)]/20"
                />
              </td>
              <td className="px-4 py-3.5">
                <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider font-mono">{req.id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="tracking-tight text-[var(--text)]">{req.type}</span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={req.entityName} hideText className="h-9 w-9" />
                  <div className="flex flex-col">
                    <span className="tracking-tight text-[var(--text)]">
                      {req.entityName}
                    </span>
                    <span className="text-[10px] font-medium text-[var(--muted)]">
                      {req.entityType === "Residents" ? "resident-profile.v1" : "establishment.v1"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <p className="max-w-[200px] truncate font-medium text-[var(--text)]/80" title={req.purpose}>{req.purpose}</p>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--text)] tracking-tight">{formatDate(req.submittedAt)}</span>
                  <span className="text-[10px] font-medium text-[var(--muted)]">{new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <StatusChip status={req.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <DropdownMenu
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                  trigger={<MoreVertical className="h-4 w-4" />}
                  items={[
                    { label: "View Details", icon: Eye, onClick: () => onView(req) },
                    { label: "Assign Staff", icon: UserPlus, onClick: () => {} },
                    { label: "Approve Request", icon: CheckCircle2, onClick: () => onUpdateStatus(req.id, "Approved"), disabled: req.status === "Approved" || req.status === "Converted" },
                    { label: "Reject Request", icon: XCircle, onClick: () => onUpdateStatus(req.id, "Rejected"), disabled: req.status === "Rejected" },
                    { label: "Convert to Document", icon: FileCheck, onClick: () => onUpdateStatus(req.id, "Converted"), disabled: req.status !== "Approved" }
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusChip({ status, className }: { status: RequestStatus; className?: string }) {
  const tones = {
    New: "bg-amber-50 text-amber-600 border-amber-200/50",
    Pending: "bg-blue-50 text-blue-600 border-blue-200/50",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-200/50",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    Rejected: "bg-rose-50 text-rose-600 border-rose-200/50",
    Converted: "bg-sky-50 text-sky-600 border-sky-200/50",
  };

  return (
    <span className={cn(
      "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
      tones[status] || "bg-slate-50 text-slate-600 border-slate-200/50",
      className
    )}>
      {status}
    </span>
  );
}
