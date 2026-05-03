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
            <th className="px-4 py-3 text-center">
              <input 
                type="checkbox" 
                checked={allVisibleSelected}
                onChange={onToggleSelectAll}
                className="rounded border-[var(--border)] accent-[var(--primary)]"
              />
            </th>
            <SortTh label="Request ID / Type" sortKey="id" current={sortBy} onSort={() => onSort("id")} active={sortBy === "id"} />
            <SortTh label="Entity / Source" sortKey="entityName" current={sortBy} onSort={() => onSort("entityName")} active={sortBy === "entityName"} />
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Purpose</th>
            <SortTh label="Submitted" sortKey="submittedAt" current={sortBy} onSort={() => onSort("submittedAt")} active={sortBy === "submittedAt"} />
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Assigned To</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Status</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
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
                  className="rounded border-[var(--border)] accent-[var(--primary)]"
                />
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider font-mono">{req.id}</span>
                  <span className="tracking-tight text-[var(--text)] font-semibold">{req.type}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={req.entityName} hideText className="h-9 w-9" />
                  <div className="flex flex-col">
                    <span className="tracking-tight text-[var(--text)] font-medium">{req.entityName}</span>
                    <span className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-widest">{req.entityType === "Residents" ? "Resident" : "Establishment"}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <p className="max-w-[160px] truncate text-xs font-medium text-[var(--muted)]" title={req.purpose}>{req.purpose}</p>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--text)] tracking-tight">{formatDate(req.submittedAt)}</span>
                  <span className="text-[10px] font-medium text-[var(--muted)]">{new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                {req.assignedStaff ? (
                  <div className="flex items-center gap-2 rounded-lg bg-[var(--card-soft)]/50 px-2 py-1 border border-[var(--border)]/50 w-fit">
                    <Avatar name={req.assignedStaff} hideText className="scale-75 origin-left" />
                    <span className="text-[11px] font-medium text-[var(--text)]">{req.assignedStaff.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-50">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    Unassigned
                  </span>
                )}
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

function SortTh({ label, sortKey, current, onSort, active }: { label: string, sortKey: string, current: string, onSort: () => void, active: boolean }) {
  return (
    <th className="px-4 py-3">
      <button onClick={onSort} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition">
        <span className={active ? "text-[var(--primary)]" : ""}>{label}</span>
        <ArrowUpDown className={cn("h-3 w-3", active ? "text-[var(--primary)]" : "opacity-0")} />
      </button>
    </th>
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
