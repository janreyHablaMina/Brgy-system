"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  ArrowUpDown,
  Home,
  MapPin,
  Calendar,
  LayoutDashboard,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import {
  Property,
  PropertyClassification,
  PropertyFilters,
  PropertyFormInput,
  PropertySortBy,
  SortDirection,
} from "../types";
import {
  formatDate,
  generatePropertyId,
  getTimestamp,
  matchesPropertyFilters,
  matchesPropertySearch,
  SEED_PROPERTIES,
  validatePropertyInput,
} from "../utils";

const CLASSIFICATION_OPTIONS: Array<"All" | PropertyClassification> = ["All", "Lot Only", "Building Only"];

const MOCK_RESIDENTS = [
  { id: "RES-2026-0001", name: "Maria Lopez Santos" },
  { id: "RES-2026-0002", name: "Juan Reyes Dela Cruz" },
  { id: "RES-2026-0003", name: "Ana Garcia Reyes" },
  { id: "RES-2026-0004", name: "Pedro Cruz Luna" },
];

const EMPTY_FILTERS: PropertyFilters = {
  classification: "All",
  registeredFrom: "",
  registeredTo: "",
};

const EMPTY_FORM: PropertyFormInput = {
  classification: "Lot Only",
  sizeSqm: "",
  houseNumber: "",
  street: "",
  purok: "",
  landmarkNorth: "",
  landmarkSouth: "",
  landmarkEast: "",
  landmarkWest: "",
  ownerName: "",
  ownerContactNo: "",
  ownerEmail: "",
  ownerAddress: "",
};

export function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PropertyFilters>(EMPTY_FILTERS);

  const [sortBy, setSortBy] = useState<PropertySortBy>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProperties(SEED_PROPERTIES);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeProperties = useMemo(() => properties.filter((p) => !p.deletedAt), [properties]);

  const processedProperties = useMemo(() => {
    const filtered = activeProperties
      .filter((p) => matchesPropertySearch(p, searchQuery))
      .filter((p) => matchesPropertyFilters(p, filters));

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "id") {
        return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      if (sortBy === "owner") {
        return sortDirection === "asc" ? a.ownerName.localeCompare(b.ownerName) : b.ownerName.localeCompare(a.ownerName);
      }
      const first = new Date(a.dateRegistered).getTime();
      const second = new Date(b.dateRegistered).getTime();
      return sortDirection === "asc" ? first - second : second - first;
    });

    return sorted;
  }, [activeProperties, filters, searchQuery, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(processedProperties.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProperties = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return processedProperties.slice(start, start + rowsPerPage);
  }, [safeCurrentPage, processedProperties, rowsPerPage]);

  const metrics = useMemo(() => {
    const total = activeProperties.length;
    const lotOnly = activeProperties.filter((p) => p.classification === "Lot Only").length;
    const buildingOnly = activeProperties.filter((p) => p.classification === "Building Only").length;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const newThisMonth = activeProperties.filter((p) => new Date(p.dateRegistered).getTime() >= startOfMonth).length;

    return { total, lotOnly, buildingOnly, newThisMonth };
  }, [activeProperties]);

  const allVisibleSelected = paginatedProperties.length > 0 && paginatedProperties.every((p) => selectedIds.has(p.id));

  function toggleSelectRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectVisibleRows() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginatedProperties.forEach((p) => next.delete(p.id));
      } else {
        paginatedProperties.forEach((p) => next.add(p.id));
      }
      return next;
    });
  }

  function openEditModal(property: Property) {
    // TODO: Transition to Edit Page or keep modal
    console.log("Edit property", property.id);
  }

  function handleDelete(id: string) {
    const now = getTimestamp();
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deletedAt: now } : p))
    );
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
        <div className="h-96 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Lot / Buildings List</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Manage property records, ownership, and building information.</p>
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
                { label: "Export as CSV", icon: FileText, onClick: () => {} },
                { label: "Export as Excel", icon: FileSpreadsheet, onClick: () => {} },
              ]}
            />
            <Link
              href="/properties/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Properties" value={metrics.total} icon={Home} tone="blue" />
          <MetricCard label="Lot Only" value={metrics.lotOnly} icon={MapPin} tone="emerald" />
          <MetricCard label="Building Only" value={metrics.buildingOnly} icon={Building2} tone="violet" />
          <MetricCard label="New This Month" value={metrics.newThisMonth} icon={CheckCircle2} tone="amber" />
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="grid gap-3 border-b border-[var(--border)] p-4 lg:grid-cols-12">
          <label className="lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] px-1">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search code, owner name, or address..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </div>
          </label>
          <div className="lg:col-span-3">
            <SelectFilter
              label="Classification"
              value={filters.classification}
              options={CLASSIFICATION_OPTIONS}
              onChange={(val) => setFilters((f) => ({ ...f, classification: val as any }))}
            />
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
             <label>
               <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] px-1">Registered From</span>
               <input
                 type="date"
                 value={filters.registeredFrom}
                 onChange={(e) => setFilters(f => ({ ...f, registeredFrom: e.target.value }))}
                 className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 [color-scheme:light]"
               />
             </label>
             <label>
               <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] px-1">Registered To</span>
               <input
                 type="date"
                 value={filters.registeredTo}
                 onChange={(e) => setFilters(f => ({ ...f, registeredTo: e.target.value }))}
                 className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 [color-scheme:light]"
               />
             </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectVisibleRows}
                    className="rounded border-[var(--border)] accent-[var(--accent)]"
                  />
                </th>
                <ThButton
                  label="Property Code"
                  active={sortBy === "id"}
                  direction={sortDirection}
                  onClick={() => {
                    if (sortBy === "id") setSortDirection(d => d === "asc" ? "desc" : "asc");
                    else { setSortBy("id"); setSortDirection("asc"); }
                  }}
                />
                <ThButton
                  label="Owner Name"
                  active={sortBy === "owner"}
                  direction={sortDirection}
                  onClick={() => {
                    if (sortBy === "owner") setSortDirection(d => d === "asc" ? "desc" : "asc");
                    else { setSortBy("owner"); setSortDirection("asc"); }
                  }}
                />
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Address</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Classification</th>
                <ThButton
                  label="Registered"
                  active={sortBy === "dateRegistered"}
                  direction={sortDirection}
                  onClick={() => {
                    if (sortBy === "dateRegistered") setSortDirection(d => d === "asc" ? "desc" : "asc");
                    else { setSortBy("dateRegistered"); setSortDirection("asc"); }
                  }}
                />
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {paginatedProperties.map((p) => (
                <tr key={p.id} className={cn("group text-[var(--text)] transition-colors hover:bg-[var(--card-soft)]/30", selectedIds.has(p.id) && "bg-[var(--primary)]/5")}>
                  <td className="relative px-4 py-3.5">
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100" />
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelectRow(p.id)}
                      className="rounded border-[var(--border)] accent-[var(--accent)]"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-medium text-[var(--muted)] uppercase">{p.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={p.ownerAvatar}
                        name={p.ownerName}
                        className="h-9 w-9"
                        hideText
                      />
                      <div className="flex flex-col">
                        <span className="tracking-tight text-[var(--text)]">
                          {p.ownerName}
                        </span>
                        <span className="text-[10px] font-medium text-[var(--muted)]">
                          resident-profile.v1
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[240px] truncate font-medium text-[var(--text)]/80">
                    {p.address}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge label={p.classification} tone={p.classification === "Lot Only" ? "emerald" : "violet"} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--muted)] font-medium">{formatDate(p.dateRegistered)}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                      trigger={<MoreHorizontal className="h-4 w-4" />}
                      items={[
                        { label: "View Details", onClick: () => setViewProperty(p), icon: Eye },
                        { label: "Edit Record", onClick: () => openEditModal(p), icon: Pencil },
                        { label: "Divider", component: <div className="my-1 h-px bg-[var(--border)]/50" /> },
                        { label: "Delete Property", onClick: () => handleDelete(p.id), icon: Trash2, className: "text-rose-600" },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                    safeCurrentPage === n ? "bg-[var(--primary)] text-white" : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                  )}
                >
                  {n}
                </button>
              ))}
              {totalPages > 5 && <span className="text-[var(--muted)]">...</span>}
            </div>
            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: "blue" | "emerald" | "violet" | "amber" }) {
  const toneStyle = tone === "emerald"
      ? "border-emerald-300/30 text-emerald-600 bg-emerald-500/5"
      : tone === "amber"
        ? "border-amber-300/30 text-amber-600 bg-amber-500/5"
        : tone === "violet"
          ? "border-violet-300/30 text-violet-600 bg-violet-500/5"
          : "border-indigo-300/30 text-indigo-600 bg-indigo-500/5";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-all hover:border-[var(--primary)]/30">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <div className={cn("rounded-lg border p-2", toneStyle)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)] tracking-tight">{value}</p>
    </article>
  );
}

function Badge({ label, tone }: { label: string; tone: "emerald" | "violet" }) {
  const styles = tone === "emerald"
    ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-600"
    : "border-violet-300/30 bg-violet-500/10 text-violet-600";

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", styles)}>
      {label}
    </span>
  );
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] px-1">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function ThButton({ label, active, direction, onClick }: { label: string; active: boolean; direction: SortDirection; onClick: () => void }) {
  return (
    <th className="px-4 py-3 text-left">
      <button onClick={onClick} className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all", active ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]")}>
        {label}
        <ArrowUpDown className={cn("h-3 w-3 transition-transform", active && direction === "desc" ? "rotate-180" : "")} />
      </button>
    </th>
  );
}
