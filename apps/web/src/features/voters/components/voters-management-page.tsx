"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { downloadCsv, downloadExcelCompatible, formatDate } from "@/features/residents/utils";

type VoterStatus = "Active" | "Inactive";
type VoterGender = "Male" | "Female" | "LGBTQIA+" | "Other";
type VoterType = "Regular" | "Senior" | "PWD" | "First-time";
type VoterSortBy = "id" | "name" | "precinctNo" | "voterType" | "status" | "lastUpdated";
type SortDirection = "asc" | "desc";

type VoterRecord = {
  id: string;
  residentId: string;
  fullName: string;
  gender: VoterGender;
  age: number;
  address: string;
  precinctNo: string;
  voterType: VoterType;
  status: VoterStatus;
  dateRegistered: string;
  lastUpdated: string;
  contactNumber?: string;
  email?: string;
  history: string[];
};

const STATUS_OPTIONS: Array<"All" | VoterStatus> = ["All", "Active", "Inactive"];
const GENDER_OPTIONS: Array<"All" | VoterGender> = ["All", "Male", "Female", "LGBTQIA+", "Other"];
const TYPE_OPTIONS: Array<"All" | VoterType> = ["All", "Regular", "Senior", "PWD", "First-time"];

const SEED_VOTERS: VoterRecord[] = [
  {
    id: "VOT-2026-0001",
    residentId: "RES-2026-0001",
    fullName: "Maria Lopez Santos",
    gender: "Female",
    age: 64,
    address: "Purok 1, Brgy. Salaza",
    precinctNo: "PCT-01A",
    voterType: "Senior",
    status: "Active",
    dateRegistered: "2024-01-15",
    lastUpdated: "2026-04-12",
    contactNumber: "09171234567",
    email: "maria.santos@example.com",
    history: ["Validated in voter masterlist - Apr 12, 2026", "Record synced from residents module - Jan 2026"],
  },
  {
    id: "VOT-2026-0002",
    residentId: "RES-2026-0002",
    fullName: "Juan Reyes Dela Cruz",
    gender: "Male",
    age: 27,
    address: "Purok 2, Brgy. Salaza",
    precinctNo: "PCT-02B",
    voterType: "Regular",
    status: "Active",
    dateRegistered: "2024-02-04",
    lastUpdated: "2026-04-11",
    contactNumber: "09981234567",
    email: "juan.delacruz@example.com",
    history: ["Precinct updated by admin - Apr 11, 2026"],
  },
  {
    id: "VOT-2026-0003",
    residentId: "RES-2026-0004",
    fullName: "Pedro Cruz Luna",
    gender: "Male",
    age: 78,
    address: "Purok 1, Brgy. Salaza",
    precinctNo: "PCT-01C",
    voterType: "Senior",
    status: "Active",
    dateRegistered: "2023-08-10",
    lastUpdated: "2026-04-03",
    history: ["Marked as assisted voter - Apr 03, 2026"],
  },
  {
    id: "VOT-2026-0004",
    residentId: "RES-2026-0009",
    fullName: "Allan Navarro",
    gender: "Male",
    age: 20,
    address: "Purok 5, Brgy. Salaza",
    precinctNo: "PCT-03A",
    voterType: "First-time",
    status: "Active",
    dateRegistered: "2026-01-25",
    lastUpdated: "2026-04-09",
    history: ["First-time voter onboarding completed - Jan 2026"],
  },
  {
    id: "VOT-2026-0005",
    residentId: "RES-2026-0010",
    fullName: "Ana Garcia Reyes",
    gender: "Female",
    age: 40,
    address: "Purok 3, Brgy. Salaza",
    precinctNo: "PCT-02A",
    voterType: "PWD",
    status: "Inactive",
    dateRegistered: "2022-05-21",
    lastUpdated: "2026-03-30",
    history: ["Set to inactive due to transfer request - Mar 30, 2026"],
  },
];

export function VotersManagementPage() {
  const [voters] = useState<VoterRecord[]>(SEED_VOTERS);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | VoterStatus>("All");
  const [genderFilter, setGenderFilter] = useState<"All" | VoterGender>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | VoterType>("All");
  const [sortBy, setSortBy] = useState<VoterSortBy>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewVoter, setViewVoter] = useState<VoterRecord | null>(null);

  const processedVoters = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    const filtered = voters
      .filter((item) => {
        if (!query) return true;
        return [item.id, item.residentId, item.fullName, item.precinctNo, item.address]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .filter((item) => statusFilter === "All" || item.status === statusFilter)
      .filter((item) => genderFilter === "All" || item.gender === genderFilter)
      .filter((item) => typeFilter === "All" || item.voterType === typeFilter);

    return [...filtered].sort((a, b) => {
      const left =
        sortBy === "lastUpdated"
          ? new Date(a.lastUpdated).getTime()
          : sortBy === "name"
            ? a.fullName.toLowerCase()
            : a[sortBy];
      const right =
        sortBy === "lastUpdated"
          ? new Date(b.lastUpdated).getTime()
          : sortBy === "name"
            ? b.fullName.toLowerCase()
            : b[sortBy];

      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [voters, searchInput, statusFilter, genderFilter, typeFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(processedVoters.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = processedVoters.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const metrics = useMemo(() => {
    const total = voters.length;
    const active = voters.filter((item) => item.status === "Active").length;
    const seniors = voters.filter((item) => item.voterType === "Senior").length;
    const firstTime = voters.filter((item) => item.voterType === "First-time").length;
    return { total, active, seniors, firstTime };
  }, [voters]);

  function toggleSort(next: VoterSortBy) {
    if (sortBy === next) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(next);
    setSortDirection("asc");
  }

  function exportData(format: "csv" | "excel") {
    const rows = [
      ["Voter ID", "Resident ID", "Full Name", "Gender", "Age", "Address", "Precinct No", "Voter Type", "Status", "Registered", "Updated"],
      ...processedVoters.map((item) => [
        item.id,
        item.residentId,
        item.fullName,
        item.gender,
        String(item.age),
        item.address,
        item.precinctNo,
        item.voterType,
        item.status,
        item.dateRegistered,
        item.lastUpdated,
      ]),
    ];

    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      downloadCsv(`voters-${stamp}.csv`, rows);
      return;
    }
    downloadExcelCompatible(`voters-${stamp}.xls`, rows);
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Voters Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Track registered voters, precinct assignments, and participation segments.</p>
          </div>
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
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Voters" value={metrics.total} icon={Users} tone="blue" />
          <MetricCard label="Active Voters" value={metrics.active} icon={CheckCircle2} tone="emerald" />
          <MetricCard label="Senior Voters" value={metrics.seniors} icon={CalendarDays} tone="amber" />
          <MetricCard label="First-time Voters" value={metrics.firstTime} icon={UserCheck} tone="violet" />
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, voter ID, resident ID, precinct..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </div>
          </label>
          <SelectFilter label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={(value) => setStatusFilter(value as "All" | VoterStatus)} />
          <SelectFilter label="Gender" value={genderFilter} options={GENDER_OPTIONS} onChange={(value) => setGenderFilter(value as "All" | VoterGender)} />
          <SelectFilter label="Type" value={typeFilter} options={TYPE_OPTIONS} onChange={(value) => setTypeFilter(value as "All" | VoterType)} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                <ThButton label="Voter" active={sortBy === "name"} direction={sortDirection} onClick={() => toggleSort("name")} />
                <ThButton label="Resident ID" active={sortBy === "id"} direction={sortDirection} onClick={() => toggleSort("id")} />
                <ThButton label="Precinct No" active={sortBy === "precinctNo"} direction={sortDirection} onClick={() => toggleSort("precinctNo")} />
                <ThButton label="Type" active={sortBy === "voterType"} direction={sortDirection} onClick={() => toggleSort("voterType")} />
                <ThButton label="Status" active={sortBy === "status"} direction={sortDirection} onClick={() => toggleSort("status")} />
                <ThButton label="Updated" active={sortBy === "lastUpdated"} direction={sortDirection} onClick={() => toggleSort("lastUpdated")} />
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {paginated.map((item) => (
                <tr key={item.id} className="group text-[var(--text)] transition-colors hover:bg-[var(--card-soft)]/30">
                  <td className="px-4 py-3.5">
                    <p>{item.fullName}</p>
                    <p className="text-[11px] font-medium text-[var(--muted)]">{item.id}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{item.residentId}</td>
                  <td className="px-4 py-3.5 font-medium text-[var(--text)]">{item.precinctNo}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">{item.voterType}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusChip status={item.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{formatDate(item.lastUpdated)}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                      trigger={<MoreHorizontal className="h-4 w-4" />}
                      items={[{ label: "View Details", icon: Eye, onClick: () => setViewVoter(item) }]}
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

      {viewVoter ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{viewVoter.fullName}</h3>
                <p className="text-xs text-[var(--muted)]">{viewVoter.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewVoter(null)}
                className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text)]"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Detail label="Resident ID" value={viewVoter.residentId} />
              <Detail label="Gender" value={viewVoter.gender} />
              <Detail label="Age" value={`${viewVoter.age}`} />
              <Detail label="Voter Type" value={viewVoter.voterType} />
              <Detail label="Status" value={viewVoter.status} />
              <Detail label="Precinct No." value={viewVoter.precinctNo} />
              <Detail label="Date Registered" value={formatDate(viewVoter.dateRegistered)} />
              <Detail label="Last Updated" value={formatDate(viewVoter.lastUpdated)} />
              <Detail label="Contact Number" value={viewVoter.contactNumber ?? "N/A"} />
              <Detail label="Email Address" value={viewVoter.email ?? "N/A"} />
              <Detail label="Address" value={viewVoter.address} />
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Recent Activity</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
                {viewVoter.history.map((item) => (
                  <li key={item} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5">
                    {item}
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
  tone: "emerald" | "amber" | "blue" | "violet";
}) {
  const toneStyle =
    tone === "emerald"
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
  direction: SortDirection;
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

function StatusChip({ status }: { status: VoterStatus }) {
  const style =
    status === "Active"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-600"
      : "border-rose-300/30 bg-rose-500/10 text-rose-600";
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", style)}>{status}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}
