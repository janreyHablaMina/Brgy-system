"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  ChevronDown,
  UserPlus,
  FileCheck,
  Building2,
  User,
  LayoutGrid,
  List,
  AlertCircle,
  Inbox,
  MoreVertical,
  Calendar,
  ShieldCheck,
  FileText,
  BadgeAlert,
  ArrowUpDown,
  Download,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import { MOCK_REQUESTS } from "../mock-data";
import { Request, RequestStatus, RequestPriority, RequestFilters } from "../types";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import type { LucideIcon } from "lucide-react";

const STATUS_ORDER: RequestStatus[] = ["New", "Pending", "Processing", "Approved", "Rejected", "Converted"];

export function RequestsManagementPage() {
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [activeTab, setActiveTab] = useState<RequestStatus | "All">("All");
  const [filters, setFilters] = useState<RequestFilters>({
    search: "",
    status: "All",
    type: "All",
    source: "All",
    staff: "All",
    dateFrom: "",
    dateTo: ""
  });
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<keyof Request>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewRequest, setViewRequest] = useState<Request | null>(null);

  const processed = useMemo(() => {
    const result = requests.filter(req => {
      const matchTab = activeTab === "All" || req.status === activeTab;
      const matchSearch = !filters.search || 
        req.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.entityName.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.purpose.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "All" || req.type === filters.type;
      const matchSource = filters.source === "All" || req.entityType === filters.source;
      const matchStaff = filters.staff === "All" || req.assignedStaff === filters.staff;
      
      return matchTab && matchSearch && matchType && matchSource && matchStaff;
    });

    result.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (!valA || !valB) return 0;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [requests, activeTab, filters, sortBy, sortDirection]);

  const metrics = useMemo(() => {
    return {
      total: requests.length,
      new: requests.filter(r => r.status === "New").length,
      pending: requests.filter(r => r.status === "Pending").length,
      processing: requests.filter(r => r.status === "Processing").length,
      approved: requests.filter(r => r.status === "Approved").length,
      rejected: requests.filter(r => r.status === "Rejected").length,
      converted: requests.filter(r => r.status === "Converted").length
    };
  }, [requests]);

  const toggleSort = (key: keyof Request) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === processed.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processed.map(r => r.id)));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          timeline: [
            ...r.timeline,
            {
              id: `evt-${r.id}-${r.timeline.length + 1}`,
              status: newStatus,
              label: `Status updated to ${newStatus}`,
              timestamp: new Date().toISOString(),
              actor: "Staff"
            }
          ]
        };
      }
      return r;
    }));
  };

  const getStatusTone = (status: RequestStatus) => {
    switch (status) {
      case "New": return "bg-amber-50 text-amber-600 border-amber-200/50";
      case "Pending": return "bg-blue-50 text-blue-600 border-blue-200/50";
      case "Processing": return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
      case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
      case "Rejected": return "bg-rose-50 text-rose-600 border-rose-200/50";
      case "Converted": return "bg-sky-50 text-sky-600 border-sky-200/50";
      default: return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Requests Management</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Manage all incoming service requests, process approvals, and track workflow status.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] hover:border-[var(--primary)]/40"
            >
              <Download className="h-4 w-4 text-[var(--primary)]" />
              Export Report
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SummaryCard icon={Inbox} label="Total Requests" value={metrics.total} tone="blue" viewAllText="View all requests" />
          <SummaryCard icon={BadgeAlert} label="New Requests" value={metrics.new} tone="amber" viewAllText="View new" />
          <SummaryCard icon={Clock} label="Pending Review" value={metrics.pending} tone="violet" viewAllText="View pending" />
          <SummaryCard icon={ArrowRightLeft} label="In Processing" value={metrics.processing} tone="indigo" viewAllText="View processing" />
          <SummaryCard icon={CheckCircle2} label="Approved" value={metrics.approved} tone="emerald" viewAllText="View approved" />
          <SummaryCard icon={XCircle} label="Rejected" value={metrics.rejected} tone="rose" viewAllText="View rejected" />
        </div>
      </header>

      {/* Workflow Navigation */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-px">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <TabButton label="All Requests" active={activeTab === "All"} onClick={() => setActiveTab("All")} />
            <div className="h-4 w-px bg-[var(--border)] mx-2" />
            {STATUS_ORDER.map(status => (
              <TabButton 
                key={status} 
                label={status} 
                active={activeTab === status} 
                onClick={() => setActiveTab(status)} 
                count={metrics[status.toLowerCase() as keyof typeof metrics]}
              />
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2 p-1 bg-[var(--card-soft)]/50 rounded-lg border border-[var(--border)]/50">
            <button className="p-1.5 rounded-md bg-[var(--card)] shadow-sm text-[var(--primary)] transition">
              <List className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] transition">
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all">
        {/* Professional Filter Bar */}
        <div className="border-b border-[var(--border)] bg-[var(--card)] p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">Search Records</span>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
                <input
                  type="text"
                  placeholder="ID, Name, Purpose..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] pl-10 pr-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] transition-all"
                />
              </div>
            </label>

            <FilterSelect 
              label="Document Type" 
              value={filters.type} 
              options={["All", "Barangay Clearance", "Certificate of Indigency", "Business Endorsement"]} 
              onChange={(v) => setFilters(prev => ({ ...prev, type: v }))} 
            />

            <FilterSelect 
              label="Source" 
              value={filters.source} 
              options={["All", "Residents", "Establishments"]} 
              onChange={(v) => setFilters(prev => ({ ...prev, source: v as RequestFilters["source"] }))} 
            />

            <DateFilter label="From Date" value={filters.dateFrom} onChange={(v) => setFilters(prev => ({ ...prev, dateFrom: v }))} />
            <DateFilter label="To Date" value={filters.dateTo} onChange={(v) => setFilters(prev => ({ ...prev, dateTo: v }))} />

            <button 
              onClick={() => setFilters({
                search: "",
                status: "All",
                type: "All",
                source: "All",
                staff: "All",
                dateFrom: "",
                dateTo: ""
              })}
              className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] hover:border-[var(--primary)]/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                <th className="px-4 py-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === processed.length && processed.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border)] accent-[var(--primary)]"
                  />
                </th>
                <SortTh label="Request ID / Type" sortKey="id" current={sortBy} direction={sortDirection} onSort={() => toggleSort("id")} />
                <SortTh label="Entity / Source" sortKey="entityName" current={sortBy} direction={sortDirection} onSort={() => toggleSort("entityName")} />
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Purpose</th>
                <SortTh label="Submitted" sortKey="submittedAt" current={sortBy} direction={sortDirection} onSort={() => toggleSort("submittedAt")} />
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Assigned To</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {processed.map(req => (
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
                      onChange={() => toggleSelectRow(req.id)}
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
                    <StatusChip status={req.status} tone={getStatusTone(req.status)} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                      trigger={<MoreVertical className="h-4 w-4" />}
                      items={[
                        { label: "View Details", icon: Eye, onClick: () => setViewRequest(req) },
                        { label: "Assign Staff", icon: UserPlus, onClick: () => {} },
                        { label: "Approve Request", icon: CheckCircle2, onClick: () => handleUpdateStatus(req.id, "Approved"), disabled: req.status === "Approved" || req.status === "Converted" },
                        { label: "Reject Request", icon: XCircle, onClick: () => handleUpdateStatus(req.id, "Rejected"), disabled: req.status === "Rejected" },
                        { label: "Convert to Document", icon: FileCheck, onClick: () => handleUpdateStatus(req.id, "Converted"), disabled: req.status !== "Approved" }
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {processed.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--card-soft)] border border-[var(--border)]">
                        <Inbox className="h-6 w-6 text-[var(--muted)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text)]">No requests found</p>
                        <p className="text-sm text-[var(--muted)]">Try adjusting your filters or search query.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/30 px-6 py-4">
          <p className="text-xs font-medium text-[var(--muted)]">
            Showing <span className="text-[var(--text)]">{processed.length}</span> of <span className="text-[var(--text)]">{requests.length}</span> requests
          </p>
          <div className="flex items-center gap-2">
            <button className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-semibold text-[var(--muted)] disabled:opacity-50">Previous</button>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg bg-[var(--primary)] text-xs font-bold text-white">1</button>
            </div>
            <button className="h-8 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-semibold text-[var(--muted)] disabled:opacity-50">Next</button>
          </div>
        </footer>
      </div>

      {/* Bulk Actions (Float) */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 px-2 border-r border-[var(--border)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">{selectedIds.size}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] hover:bg-[var(--card)] transition">
              <UserPlus className="h-3.5 w-3.5" />
              Assign
            </button>
            <button className="flex h-9 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve
            </button>
            <button className="flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition">
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)]">Cancel</button>
          </div>
        </div>
      )}

      {/* Details Modal (Overlay) */}
      {viewRequest && (
        <RequestDetailsOverlay 
          request={viewRequest} 
          onClose={() => setViewRequest(null)} 
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
  viewAllText,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "amber" | "blue" | "emerald" | "rose" | "indigo" | "violet" | "sky";
  viewAllText?: string;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/5 text-amber-600"
      : tone === "blue"
        ? "border-blue-300/30 bg-blue-500/5 text-blue-600"
        : tone === "rose"
          ? "border-rose-300/30 bg-rose-500/5 text-rose-600"
          : tone === "indigo"
            ? "border-indigo-300/30 bg-indigo-500/5 text-indigo-600"
            : tone === "violet"
              ? "border-violet-300/30 bg-violet-500/5 text-violet-600"
              : tone === "sky"
                ? "border-sky-300/30 bg-sky-500/5 text-sky-600"
                : "border-emerald-300/30 bg-emerald-500/5 text-emerald-600";

  const iconBg = 
    tone === "amber" ? "bg-amber-50" :
    tone === "blue" ? "bg-blue-50" :
    tone === "rose" ? "bg-rose-50" :
    tone === "indigo" ? "bg-indigo-50" :
    tone === "violet" ? "bg-violet-50" :
    tone === "sky" ? "bg-sky-50" : "bg-emerald-50";

  return (
    <article className={cn(
      "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--primary)]/20",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
      tone === "amber" ? "before:bg-amber-400" :
      tone === "blue" ? "before:bg-blue-400" :
      tone === "rose" ? "before:bg-rose-400" :
      tone === "indigo" ? "before:bg-indigo-400" :
      tone === "violet" ? "before:bg-violet-400" :
      tone === "sky" ? "before:bg-sky-400" : "before:bg-emerald-400"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
          <p className="text-3xl font-bold text-[var(--text)]">{value}</p>
        </div>
        <div className={cn("rounded-xl p-2.5", iconBg, toneClass.split(' ')[2])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {viewAllText && (
        <div className="group mt-4 flex items-center justify-between border-t border-[var(--border)]/50 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] transition-colors group-hover:text-[var(--primary)]">
            {viewAllText}
          </span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card-soft)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </article>
  );
}

function TabButton({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex h-10 items-center gap-2 px-4 text-sm font-semibold transition-all whitespace-nowrap",
        active ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all",
          active ? "bg-[var(--primary)] text-white" : "bg-[var(--card-soft)] text-[var(--muted)]"
        )}>
          {count}
        </span>
      )}
      {active && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--primary)]" />}
    </button>
  );
}

function SortTh({ label, sortKey, current, direction, onSort }: { label: string, sortKey: string, current: string, direction: string, onSort: () => void }) {
  const active = current === sortKey;
  return (
    <th className="px-4 py-3">
      <button onClick={onSort} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition">
        <span className={active ? "text-[var(--primary)]" : ""}>{label}</span>
        <ArrowUpDown className={cn("h-3 w-3", active ? "text-[var(--primary)]" : "opacity-0")} />
      </button>
    </th>
  );
}

function StatusChip({ status, tone, className }: { status: string; tone: string; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", tone, className)}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const styles = {
    Low: "text-blue-500",
    Normal: "text-slate-500",
    High: "text-amber-600",
    Urgent: "text-rose-600"
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("h-1.5 w-1.5 rounded-full bg-current", styles[priority])} />
      <span className={cn("text-[11px] font-semibold", styles[priority])}>{priority}</span>
    </div>
  );
}

function RequestDetailsOverlay({ request, onClose, onUpdateStatus }: { request: Request, onClose: () => void, onUpdateStatus: (id: string, s: RequestStatus) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-[var(--card-soft)]/50">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{request.id}</h2>
              <p className="text-xs text-[var(--muted)]">Submitted on {formatDate(request.submittedAt)} at {new Date(request.submittedAt).toLocaleTimeString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] transition">
            <XCircle className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Entity Section */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Requester Information</h3>
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/30 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[var(--border)] text-slate-400 shadow-sm">
                  <User className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[var(--text)]">{request.entityName}</p>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 uppercase border border-blue-100">{request.entityType}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">ID: {request.entityId}</p>
                </div>
              </div>
            </section>

            {/* Request Content */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Request Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Document Type" value={request.type} icon={FileCheck} />
                <DetailItem label="Priority" value={request.priority} icon={BadgeAlert} />
                <DetailItem label="Assigned Staff" value={request.assignedStaff || "Unassigned"} icon={UserPlus} />
                <DetailItem label="Purpose" value={request.purpose} icon={Inbox} fullWidth />
                {request.remarks && <DetailItem label="Remarks" value={request.remarks} icon={AlertCircle} fullWidth />}
              </div>
            </section>

            {/* Action History */}
            <section>
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Activity Timeline</h3>
              <div className="space-y-4">
                {request.timeline.map((evt, idx) => (
                  <div key={evt.id} className="relative flex gap-4">
                    {idx !== request.timeline.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-px bg-[var(--border)]" />
                    )}
                    <div className={cn(
                      "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs",
                      evt.status === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                      evt.status === "Rejected" ? "bg-rose-50 border-rose-200 text-rose-600" :
                      "bg-slate-50 border-slate-200 text-slate-600"
                    )}>
                      {evt.status === "Approved" ? <CheckCircle2 className="h-4 w-4" /> : 
                       evt.status === "Rejected" ? <XCircle className="h-4 w-4" /> : 
                       <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[var(--text)]">{evt.label}</p>
                        <span className="text-[10px] text-[var(--muted)]">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)]">By: {evt.actor}</p>
                      {evt.remarks && (
                        <div className="mt-2 rounded-lg bg-[var(--card-soft)] p-2 text-xs text-[var(--text)] border border-[var(--border)]">
                          {evt.remarks}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/50 p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Control Center</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => onUpdateStatus(request.id, "Processing")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm font-bold text-[var(--text)] hover:bg-[var(--card-soft)] transition shadow-sm"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Mark as Processing
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, "Approved")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:brightness-110 transition shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Request
                </button>
                <button 
                  onClick={() => onUpdateStatus(request.id, "Rejected")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 text-sm font-bold text-white hover:brightness-110 transition shadow-md shadow-rose-600/20"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Request
                </button>
              </div>
              <div className="pt-2 border-t border-[var(--border)]">
                <button 
                  disabled={request.status !== "Approved"}
                  onClick={() => onUpdateStatus(request.id, "Converted")}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[var(--primary)]/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Convert to Document
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Admin Notes</h3>
              <textarea 
                placeholder="Add internal notes about this request..."
                className="w-full h-32 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 text-xs outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
              />
              <button className="w-full h-9 rounded-lg bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white transition hover:brightness-125">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          className="h-10 w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)]"
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
          className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
        />
        <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none transition-colors group-focus-within/date:text-[var(--primary)]" />
      </div>
    </label>
  );
}

function DetailItem({ label, value, icon: Icon, fullWidth }: { label: string, value: string, icon: LucideIcon, fullWidth?: boolean }) {
  return (
    <div className={cn("space-y-1.5", fullWidth && "sm:col-span-2")}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p>
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 shadow-sm">
        <Icon className="h-4 w-4 text-[var(--muted)]" />
        <span className="text-sm font-medium text-[var(--text)]">{value}</span>
      </div>
    </div>
  );
}
