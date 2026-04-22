"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Store,
  XCircle,
} from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { downloadCsv, downloadExcelCompatible, formatDate } from "@/features/residents/utils";

type EstablishmentStatus = "Active" | "Inactive" | "Suspended";
type PermitState = "Valid" | "Expiring Soon" | "Expired";
type BusinessType =
  | "Retail"
  | "Food & Beverage"
  | "Service"
  | "Health"
  | "Manufacturing"
  | "Transport";

type Establishment = {
  id: string;
  name: string;
  owner: string;
  address: string;
  businessType: BusinessType;
  status: EstablishmentStatus;
  permitNumber: string;
  permitExpiry: string;
  dateRegistered: string;
  lastUpdated: string;
  contactNo: string;
  email: string;
  activityLog: string[];
};

type PendingEstablishment = {
  businessName: string;
  businessType: string;
  contactNumber: string;
  emailAddress: string;
  houseNo: string;
  street: string;
  purok: string;
  ownerProfilePhotoName: string;
  ownerFullName: string;
  ownerContactNo: string;
  ownerEmail: string;
  ownerAddress: string;
};

const BUSINESS_TYPES: BusinessType[] = [
  "Retail",
  "Food & Beverage",
  "Service",
  "Health",
  "Manufacturing",
  "Transport",
];

const STATUS_OPTIONS: Array<"All" | EstablishmentStatus> = ["All", "Active", "Inactive", "Suspended"];
const PERMIT_FILTER_OPTIONS: Array<"All" | PermitState> = ["All", "Valid", "Expiring Soon", "Expired"];
const PENDING_ESTABLISHMENTS_KEY = "brgy-pending-establishments";

const SEED_ESTABLISHMENTS: Establishment[] = [
  {
    id: "EST-2026-0001",
    name: "Salaza Mart",
    owner: "Maria Dela Cruz",
    address: "Purok 1, Brgy. Salaza",
    businessType: "Retail",
    status: "Active",
    permitNumber: "BP-2026-1101",
    permitExpiry: "2026-07-15",
    dateRegistered: "2024-03-10",
    lastUpdated: "2026-04-10",
    contactNo: "09171234567",
    email: "salazamart@example.com",
    activityLog: ["Permit verified - Apr 10, 2026", "Owner profile updated - Mar 30, 2026"],
  },
  {
    id: "EST-2026-0002",
    name: "Kusina ni Liza",
    owner: "Liza Gonzales",
    address: "Purok 2, Brgy. Salaza",
    businessType: "Food & Beverage",
    status: "Active",
    permitNumber: "BP-2026-1102",
    permitExpiry: "2026-05-05",
    dateRegistered: "2025-01-18",
    lastUpdated: "2026-04-12",
    contactNo: "09981230001",
    email: "kusinaniliza@example.com",
    activityLog: ["Renewal reminder sent - Apr 12, 2026"],
  },
  {
    id: "EST-2026-0003",
    name: "AquaWave Refilling",
    owner: "Mark Aquino",
    address: "Purok 3, Brgy. Salaza",
    businessType: "Service",
    status: "Suspended",
    permitNumber: "BP-2025-0822",
    permitExpiry: "2026-03-20",
    dateRegistered: "2023-09-04",
    lastUpdated: "2026-04-01",
    contactNo: "09170002222",
    email: "aquawave@example.com",
    activityLog: ["Status updated to Suspended - Apr 01, 2026"],
  },
  {
    id: "EST-2026-0004",
    name: "Salaza Mercury Clinic",
    owner: "Dr. Paolo Reyes",
    address: "Purok 5, Brgy. Salaza",
    businessType: "Health",
    status: "Active",
    permitNumber: "BP-2026-1033",
    permitExpiry: "2027-01-12",
    dateRegistered: "2022-05-11",
    lastUpdated: "2026-04-02",
    contactNo: "09173335555",
    email: "clinic@example.com",
    activityLog: ["Inspection passed - Apr 02, 2026"],
  },
  {
    id: "EST-2026-0005",
    name: "TriCycle Parts Hub",
    owner: "Pedro Luna",
    address: "Purok 4, Brgy. Salaza",
    businessType: "Transport",
    status: "Inactive",
    permitNumber: "BP-2024-4021",
    permitExpiry: "2025-12-08",
    dateRegistered: "2021-11-19",
    lastUpdated: "2026-02-18",
    contactNo: "09174444444",
    email: "tricycleparts@example.com",
    activityLog: ["Marked inactive - Feb 18, 2026"],
  },
];

function generateEstablishmentId(existing: Establishment[]) {
  const year = new Date().getFullYear();
  const numericParts = existing
    .map((item) => Number.parseInt(item.id.split("-").at(-1) ?? "0", 10))
    .filter(Number.isFinite);
  const next = (Math.max(0, ...numericParts) + 1).toString().padStart(4, "0");
  return `EST-${year}-${next}`;
}

function appendPendingEstablishments(base: Establishment[], pendingItems: PendingEstablishment[]) {
  let next = [...base];
  pendingItems.forEach((pending) => {
    const today = new Date().toISOString().slice(0, 10);
    const defaultExpiry = new Date();
    defaultExpiry.setMonth(defaultExpiry.getMonth() + 6);
    const businessType = BUSINESS_TYPES.includes(pending.businessType as BusinessType)
      ? (pending.businessType as BusinessType)
      : "Service";

    next = [
      {
        id: generateEstablishmentId(next),
        name: pending.businessName.trim() || "Unnamed Establishment",
        owner: pending.ownerFullName.trim() || "Unassigned Owner",
        address: [pending.houseNo, pending.street, pending.purok].filter(Boolean).join(", ") || "Address not provided",
        businessType,
        status: "Active",
        permitNumber: `BP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        permitExpiry: defaultExpiry.toISOString().slice(0, 10),
        dateRegistered: today,
        lastUpdated: today,
        contactNo: pending.contactNumber || pending.ownerContactNo || "N/A",
        email: pending.emailAddress || pending.ownerEmail || "N/A",
        activityLog: ["Establishment profile created via add form"],
      },
      ...next,
    ];
  });
  return next;
}

function getPermitState(expiryDate: string): PermitState {
  const now = Date.now();
  const expiry = new Date(expiryDate).getTime();
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Expired";
  if (diffDays <= 45) return "Expiring Soon";
  return "Valid";
}

export function EstablishmentsManagementPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>(() => {
    if (typeof window === "undefined") {
      return SEED_ESTABLISHMENTS;
    }

    const raw = localStorage.getItem(PENDING_ESTABLISHMENTS_KEY);
    if (!raw) {
      return SEED_ESTABLISHMENTS;
    }

    try {
      const pendingItems = JSON.parse(raw) as PendingEstablishment[];
      if (!Array.isArray(pendingItems) || pendingItems.length === 0) {
        localStorage.removeItem(PENDING_ESTABLISHMENTS_KEY);
        return SEED_ESTABLISHMENTS;
      }
      localStorage.removeItem(PENDING_ESTABLISHMENTS_KEY);
      return appendPendingEstablishments(SEED_ESTABLISHMENTS, pendingItems);
    } catch {
      localStorage.removeItem(PENDING_ESTABLISHMENTS_KEY);
      return SEED_ESTABLISHMENTS;
    }
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | EstablishmentStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | BusinessType>("All");
  const [permitFilter, setPermitFilter] = useState<"All" | PermitState>("All");
  const [sortBy, setSortBy] = useState<"name" | "owner" | "address" | "businessType" | "status" | "permitExpiry" | "lastUpdated">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewItem, setViewItem] = useState<Establishment | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<EstablishmentStatus | "">("");

  const processed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = establishments.filter((item) => {
      const permitState = getPermitState(item.permitExpiry);
      const matchSearch =
        q.length === 0 ||
        [item.id, item.name, item.owner, item.address, item.permitNumber]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchType = typeFilter === "All" || item.businessType === typeFilter;
      const matchPermit = permitFilter === "All" || permitState === permitFilter;
      return matchSearch && matchStatus && matchType && matchPermit;
    });

    const sorted = [...filtered].sort((a, b) => {
      const valueA = sortBy === "permitExpiry" || sortBy === "lastUpdated"
        ? new Date(a[sortBy]).getTime()
        : a[sortBy].toLowerCase();
      const valueB = sortBy === "permitExpiry" || sortBy === "lastUpdated"
        ? new Date(b[sortBy]).getTime()
        : b[sortBy].toLowerCase();
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [establishments, search, statusFilter, typeFilter, permitFilter, sortBy, sortDirection]);

  const metrics = useMemo(() => {
    const total = establishments.length;
    const active = establishments.filter((item) => item.status === "Active").length;
    const inactive = establishments.filter((item) => item.status !== "Active").length;
    const expiringSoon = establishments.filter((item) => getPermitState(item.permitExpiry) === "Expiring Soon").length;
    const expired = establishments.filter((item) => getPermitState(item.permitExpiry) === "Expired").length;
    return { total, active, inactive, expiringSoon, expired };
  }, [establishments]);

  const totalPages = Math.max(1, Math.ceil(processed.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = processed.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const allVisibleSelected =
    paginated.length > 0 && paginated.every((item) => selectedIds.has(item.id));

  function toggleSelectRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectVisibleRows() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginated.forEach((item) => next.delete(item.id));
      } else {
        paginated.forEach((item) => next.add(item.id));
      }
      return next;
    });
  }

  function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected establishments?`)) return;
    
    const idsToDelete = Array.from(selectedIds);
    setEstablishments((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedIds(new Set());
  }

  function handleBulkStatusUpdate(status: EstablishmentStatus) {
    if (selectedIds.size === 0) return;
    const updated = new Date().toISOString().slice(0, 10);
    setEstablishments((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id)
          ? {
              ...item,
              status,
              lastUpdated: updated,
              activityLog: [`Bulk status updated to ${status}`, ...item.activityLog],
            }
          : item
      )
    );
    setBulkStatus("");
  }

  function toggleSort(next: "name" | "owner" | "address" | "businessType" | "status" | "permitExpiry" | "lastUpdated") {
    if (sortBy === next) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(next);
    setSortDirection("asc");
  }

  function exportData(format: "csv" | "excel") {
    const rows = [
      ["ID", "Name", "Owner", "Address", "Business Type", "Status", "Permit Number", "Permit Status", "Permit Expiry", "Registered", "Updated"],
      ...processed.map((item) => [
        item.id,
        item.name,
        item.owner,
        item.address,
        item.businessType,
        item.status,
        item.permitNumber,
        getPermitState(item.permitExpiry),
        item.permitExpiry,
        item.dateRegistered,
        item.lastUpdated,
      ]),
    ];

    if (format === "csv") {
      downloadCsv(`establishments-${new Date().toISOString().slice(0, 10)}.csv`, rows);
      return;
    }
    downloadExcelCompatible(`establishments-${new Date().toISOString().slice(0, 10)}.xls`, rows);
  }

  function renewPermit(id: string) {
    const nextExpiry = new Date();
    nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);
    const expiry = nextExpiry.toISOString().slice(0, 10);
    const updated = new Date().toISOString().slice(0, 10);
    setEstablishments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              permitExpiry: expiry,
              lastUpdated: updated,
              activityLog: [`Permit renewed to ${expiry}`, ...item.activityLog],
            }
          : item
      )
    );
  }

  function updateStatus(id: string, status: EstablishmentStatus) {
    const updated = new Date().toISOString().slice(0, 10);
    setEstablishments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              lastUpdated: updated,
              activityLog: [`Status updated to ${status}`, ...item.activityLog],
            }
          : item
      )
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Establishments Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Monitor businesses, permit lifecycles, and compliance signals in one workspace.</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu
              className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)]"
              trigger={
                <span className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4 text-[var(--primary)]" />
                  Export
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </span>
              }
              items={[
                { label: "Export as CSV", icon: FileText, onClick: () => exportData("csv") },
                { label: "Export as Excel", icon: FileSpreadsheet, onClick: () => exportData("excel") },
              ]}
            />
            <Link
              href="/establishments/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Establishment
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Total Establishments" value={metrics.total} icon={Store} tone="blue" />
          <MetricCard label="Active" value={metrics.active} icon={CheckCircle2} tone="emerald" />
          <MetricCard label="Inactive / Suspended" value={metrics.inactive} icon={XCircle} tone="amber" />
          <MetricCard label="Expiring Soon" value={metrics.expiringSoon} icon={CalendarClock} tone="violet" />
          <MetricCard label="Expired Permits" value={metrics.expired} icon={ShieldAlert} tone="rose" />
        </div>

        {(metrics.expiringSoon > 0 || metrics.expired > 0) ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span>{metrics.expired} expired and {metrics.expiringSoon} expiring permits need review.</span>
          </div>
        ) : null}
      </header>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, owner, permit no., address..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </div>
          </label>
          <SelectFilter label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={(value) => setStatusFilter(value as "All" | EstablishmentStatus)} />
          <SelectFilter label="Business Type" value={typeFilter} options={["All", ...BUSINESS_TYPES]} onChange={(value) => setTypeFilter(value as "All" | BusinessType)} />
          <SelectFilter label="Permit State" value={permitFilter} options={PERMIT_FILTER_OPTIONS} onChange={(value) => setPermitFilter(value as "All" | PermitState)} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectVisibleRows}
                    className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                    aria-label="Select all visible establishments"
                  />
                </th>
                <ThButton label="ID / Establishment" active={sortBy === "name"} direction={sortDirection} onClick={() => toggleSort("name")} />
                <ThButton label="Owner" active={sortBy === "owner"} direction={sortDirection} onClick={() => toggleSort("owner")} />
                <ThButton label="Address" active={sortBy === "address"} direction={sortDirection} onClick={() => toggleSort("address")} />
                <ThButton label="Business Type" active={sortBy === "businessType"} direction={sortDirection} onClick={() => toggleSort("businessType")} />
                <ThButton label="Status" active={sortBy === "status"} direction={sortDirection} onClick={() => toggleSort("status")} />
                <ThButton label="Permit Expiry" active={sortBy === "permitExpiry"} direction={sortDirection} onClick={() => toggleSort("permitExpiry")} />
                <ThButton label="Updated" active={sortBy === "lastUpdated"} direction={sortDirection} onClick={() => toggleSort("lastUpdated")} />
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {paginated.map((item) => {
                const permitState = getPermitState(item.permitExpiry);
                return (
                  <tr key={item.id} className={cn("group text-[var(--text)] transition-colors", selectedIds.has(item.id) && "bg-[var(--primary)]/5")}>
                    <td className="relative px-4 py-3.5">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                        aria-label={`Select ${item.name}`}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[var(--text)]">{item.name}</p>
                      <p className="text-[11px] font-medium text-[var(--muted)]">{item.id}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[var(--text)]">{item.owner}</td>
                    <td className="px-4 py-3.5 text-[var(--muted)]">{item.address}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">{item.businessType}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusChip status={item.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <PermitChip state={permitState} expiry={item.permitExpiry} />
                    </td>
                    <td className="px-4 py-3.5 text-[var(--muted)]">{formatDate(item.lastUpdated)}</td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                        trigger={<MoreHorizontal className="h-4 w-4" />}
                        items={[
                          { label: "View Details", icon: Eye, onClick: () => setViewItem(item) },
                          { label: "Edit Record", icon: Pencil, onClick: () => setViewItem(item) },
                          { label: "Renew Permit", icon: CalendarClock, onClick: () => renewPermit(item.id) },
                          { label: "Set Active", onClick: () => updateStatus(item.id, "Active"), disabled: item.status === "Active" },
                          { label: "Set Inactive", onClick: () => updateStatus(item.id, "Inactive"), disabled: item.status === "Inactive" },
                          { label: "Set Suspended", onClick: () => updateStatus(item.id, "Suspended"), disabled: item.status === "Suspended" },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--primary)]/[0.03] px-6 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                {selectedIds.size}
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)]">Establishments Selected</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center h-9 bg-[var(--card)] rounded-xl border border-[var(--border)] px-1">
                <div className="relative group/bulk flex items-center">
                  <select
                    value={bulkStatus}
                    onChange={(event) => {
                      const newStatus = event.target.value as EstablishmentStatus;
                      setBulkStatus(newStatus);
                      if (newStatus) handleBulkStatusUpdate(newStatus);
                    }}
                    className="h-7 w-40 bg-transparent px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] outline-none appearance-none cursor-pointer group-hover/bulk:text-[var(--primary)] transition-colors"
                  >
                    <option value="" disabled>Update Status...</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]/40 pointer-events-none group-hover/bulk:text-[var(--primary)] transition-colors" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-[10px] font-bold uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-100 hover:border-rose-300"
              >
                Delete Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-colors px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Page <span className="text-[var(--text)]">{safePage}</span> of {totalPages}
            </span>
            <div className="h-3 w-px bg-[var(--border)]" />
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Rows
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setCurrentPage(1);
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
              type="button"
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
              disabled={safePage === 1}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                      safePage === pageNum
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 ? <span className="text-[var(--muted)]">...</span> : null}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.min(totalPages, Math.min(value, totalPages) + 1))}
              disabled={safePage === totalPages}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </footer>
      </section>

      {viewItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{viewItem.name}</h3>
                <p className="text-xs text-[var(--muted)]">{viewItem.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text)]"
              >
                Close
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Detail label="Owner" value={viewItem.owner} />
              <Detail label="Business Type" value={viewItem.businessType} />
              <Detail label="Status" value={viewItem.status} />
              <Detail label="Permit Number" value={viewItem.permitNumber} />
              <Detail label="Permit Expiry" value={formatDate(viewItem.permitExpiry)} />
              <Detail label="Registered Date" value={formatDate(viewItem.dateRegistered)} />
              <Detail label="Updated Date" value={formatDate(viewItem.lastUpdated)} />
              <Detail label="Contact" value={viewItem.contactNo} />
              <Detail label="Email" value={viewItem.email} />
              <Detail label="Address" value={viewItem.address} />
            </div>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Recent Activity</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
                {viewItem.activityLog.map((log) => (
                  <li key={log} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5">
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "amber" | "blue" | "violet" | "rose";
}) {
  const toneStyle =
    tone === "emerald"
      ? "border-emerald-300/30 text-emerald-600 bg-emerald-500/5"
      : tone === "amber"
        ? "border-amber-300/30 text-amber-600 bg-amber-500/5"
        : tone === "violet"
          ? "border-violet-300/30 text-violet-600 bg-violet-500/5"
          : tone === "rose"
            ? "border-rose-300/30 text-rose-600 bg-rose-500/5"
            : "border-indigo-300/30 text-indigo-600 bg-indigo-500/5";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <div className={cn("rounded-lg border p-2", toneStyle)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function SelectFilter({
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
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ThButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]",
          active ? "text-[var(--primary)]" : "text-[var(--muted)]"
        )}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3 transition-transform", active && direction === "desc" ? "rotate-180" : "")} />
      </button>
    </th>
  );
}

function StatusChip({ status }: { status: EstablishmentStatus }) {
  const style =
    status === "Active"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-600"
      : status === "Suspended"
        ? "border-rose-300/30 bg-rose-500/10 text-rose-600"
        : "border-amber-300/30 bg-amber-500/10 text-amber-600";
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", style)}>{status}</span>;
}

function PermitChip({ state, expiry }: { state: PermitState; expiry: string }) {
  const style =
    state === "Valid"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-600"
      : state === "Expiring Soon"
        ? "border-amber-300/30 bg-amber-500/10 text-amber-600"
        : "border-rose-300/30 bg-rose-500/10 text-rose-600";
  return (
    <div>
      <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", style)}>{state}</span>
      <p className="mt-1 text-[11px] text-[var(--muted)]">{formatDate(expiry)}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value || "N/A"}</p>
    </div>
  );
}
