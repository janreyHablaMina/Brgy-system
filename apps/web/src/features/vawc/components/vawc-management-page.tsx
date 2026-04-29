"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  HeartHandshake,
  MoreHorizontal,
  Search,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { downloadCsv, downloadExcelCompatible, formatDate } from "@/features/residents/utils";
import { MOCK_VAWC_CASES } from "@/features/vawc/mock-data";
import type { VawcCase, VawcCaseStatus, VawcCaseType, VawcRiskLevel } from "@/features/vawc/types";

type SortDirection = "asc" | "desc";
type SortBy = "id" | "survivorAlias" | "riskLevel" | "status" | "nextActionDate" | "updatedAt";

const STATUS_OPTIONS: Array<"All" | VawcCaseStatus> = ["All", "Open", "For Interview", "For Referral", "Closed"];
const RISK_OPTIONS: Array<"All" | VawcRiskLevel> = ["All", "Low", "Moderate", "High", "Critical"];
const TYPE_OPTIONS: Array<"All" | VawcCaseType> = [
  "All",
  "Psychological Abuse",
  "Physical Abuse",
  "Economic Abuse",
  "Sexual Abuse",
  "Child Neglect",
  "Other",
];

export function VawcManagementPage() {
  const [cases] = useState<VawcCase[]>(MOCK_VAWC_CASES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | VawcCaseStatus>("All");
  const [riskFilter, setRiskFilter] = useState<"All" | VawcRiskLevel>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | VawcCaseType>("All");
  const [sortBy, setSortBy] = useState<SortBy>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewCase, setViewCase] = useState<VawcCase | null>(null);

  const processedCases = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = cases
      .filter((item) =>
        !query
          ? true
          : [item.id, item.survivorAlias, item.respondentAlias, item.caseType, item.assignedOfficer, item.referralPartner]
              .join(" ")
              .toLowerCase()
              .includes(query)
      )
      .filter((item) => statusFilter === "All" || item.status === statusFilter)
      .filter((item) => riskFilter === "All" || item.riskLevel === riskFilter)
      .filter((item) => typeFilter === "All" || item.caseType === typeFilter);

    return [...filtered].sort((a, b) => {
      const left =
        sortBy === "nextActionDate" || sortBy === "updatedAt"
          ? new Date(a[sortBy]).getTime()
          : String(a[sortBy]).toLowerCase();
      const right =
        sortBy === "nextActionDate" || sortBy === "updatedAt"
          ? new Date(b[sortBy]).getTime()
          : String(b[sortBy]).toLowerCase();
      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [cases, search, statusFilter, riskFilter, typeFilter, sortBy, sortDirection]);

  const metrics = useMemo(() => {
    const total = cases.length;
    const active = cases.filter((item) => item.status !== "Closed").length;
    const highRisk = cases.filter((item) => item.riskLevel === "High" || item.riskLevel === "Critical").length;
    const protectedCases = cases.filter((item) => item.protectionOrder !== "None").length;
    return { total, active, highRisk, protectedCases };
  }, [cases]);

  const totalPages = Math.max(1, Math.ceil(processedCases.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = processedCases.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  function toggleSort(next: SortBy) {
    if (sortBy === next) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(next);
    setSortDirection("asc");
  }

  function exportData(format: "csv" | "excel") {
    const rows = [
      [
        "Case ID",
        "Survivor Alias",
        "Respondent Alias",
        "Case Type",
        "Risk Level",
        "Status",
        "Date Reported",
        "Next Action",
        "Protection Order",
        "Assigned Officer",
        "Referral Partner",
        "Updated At",
      ],
      ...processedCases.map((item) => [
        item.id,
        item.survivorAlias,
        item.respondentAlias,
        item.caseType,
        item.riskLevel,
        item.status,
        item.dateReported,
        item.nextActionDate,
        item.protectionOrder,
        item.assignedOfficer,
        item.referralPartner,
        item.updatedAt,
      ]),
    ];
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      downloadCsv(`vawc-cases-${stamp}.csv`, rows);
      return;
    }
    downloadExcelCompatible(`vawc-cases-${stamp}.xls`, rows);
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Violence Against Women and Children (VAWC) Desk</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage protected case intake, risk-level tracking, referrals, and survivor-focused safety actions.
            </p>
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
          <MetricCard label="Total Cases" value={metrics.total} icon={ShieldAlert} tone="blue" />
          <MetricCard label="Active Cases" value={metrics.active} icon={AlertTriangle} tone="amber" />
          <MetricCard label="High/Critical Risk" value={metrics.highRisk} icon={HeartHandshake} tone="rose" />
          <MetricCard label="With Protection Order" value={metrics.protectedCases} icon={CheckCircle2} tone="emerald" />
        </div>
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
                placeholder="Search case ID, aliases, type, officer, or referral..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </div>
          </label>
          <SelectFilter label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={(value) => setStatusFilter(value as "All" | VawcCaseStatus)} />
          <SelectFilter label="Risk Level" value={riskFilter} options={RISK_OPTIONS} onChange={(value) => setRiskFilter(value as "All" | VawcRiskLevel)} />
          <SelectFilter label="Case Type" value={typeFilter} options={TYPE_OPTIONS} onChange={(value) => setTypeFilter(value as "All" | VawcCaseType)} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                <ThButton label="Case" active={sortBy === "id"} direction={sortDirection} onClick={() => toggleSort("id")} />
                <ThButton label="Survivor" active={sortBy === "survivorAlias"} direction={sortDirection} onClick={() => toggleSort("survivorAlias")} />
                <ThButton label="Risk" active={sortBy === "riskLevel"} direction={sortDirection} onClick={() => toggleSort("riskLevel")} />
                <ThButton label="Status" active={sortBy === "status"} direction={sortDirection} onClick={() => toggleSort("status")} />
                <ThButton label="Next Action" active={sortBy === "nextActionDate"} direction={sortDirection} onClick={() => toggleSort("nextActionDate")} />
                <ThButton label="Updated" active={sortBy === "updatedAt"} direction={sortDirection} onClick={() => toggleSort("updatedAt")} />
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {paginated.map((item) => (
                <tr key={item.id} className="group text-[var(--text)] transition-colors hover:bg-[var(--card-soft)]/30">
                  <td className="px-4 py-3.5">
                    <p>{item.id}</p>
                    <p className="text-[11px] font-medium text-[var(--muted)]">{item.caseType}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p>{item.survivorAlias}</p>
                    <p className="text-[11px] text-[var(--muted)]">vs {item.respondentAlias}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <RiskChip risk={item.riskLevel} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusChip status={item.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{formatDate(item.nextActionDate)}</td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{formatDate(item.updatedAt)}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                      trigger={<MoreHorizontal className="h-4 w-4" />}
                      items={[{ label: "View Details", icon: Eye, onClick: () => setViewCase(item) }]}
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
            <button
              type="button"
              onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
              disabled={safePage === totalPages}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </footer>
      </section>

      {viewCase ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{viewCase.id}</h3>
                <p className="text-xs text-[var(--muted)]">
                  {viewCase.caseType} • {viewCase.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewCase(null)}
                className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text)]"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Detail label="Survivor Alias" value={viewCase.survivorAlias} />
              <Detail label="Respondent Alias" value={viewCase.respondentAlias} />
              <Detail label="Case Type" value={viewCase.caseType} />
              <Detail label="Risk Level" value={viewCase.riskLevel} />
              <Detail label="Status" value={viewCase.status} />
              <Detail label="Protection Order" value={viewCase.protectionOrder} />
              <Detail label="Date Reported" value={formatDate(viewCase.dateReported)} />
              <Detail label="Next Action Date" value={formatDate(viewCase.nextActionDate)} />
              <Detail label="Assigned Officer" value={viewCase.assignedOfficer} />
              <Detail label="Referral Partner" value={viewCase.referralPartner} />
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Case Summary</p>
              <p className="mt-2 text-sm text-[var(--text)]">{viewCase.summary}</p>
            </div>

            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Safety Plan</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
                {viewCase.safetyPlan.map((item) => (
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
  tone: "emerald" | "amber" | "blue" | "rose";
}) {
  const toneStyle =
    tone === "emerald"
      ? "border-emerald-300/30 text-emerald-600 bg-emerald-500/5"
      : tone === "amber"
        ? "border-amber-300/30 text-amber-600 bg-amber-500/5"
        : tone === "rose"
          ? "border-rose-300/30 text-rose-600 bg-rose-500/5"
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

function StatusChip({ status }: { status: VawcCaseStatus }) {
  const style =
    status === "Closed"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-600"
      : status === "For Interview"
        ? "border-indigo-300/30 bg-indigo-500/10 text-indigo-600"
        : status === "For Referral"
          ? "border-amber-300/30 bg-amber-500/10 text-amber-600"
          : "border-rose-300/30 bg-rose-500/10 text-rose-600";
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", style)}>{status}</span>;
}

function RiskChip({ risk }: { risk: VawcRiskLevel }) {
  const style =
    risk === "Critical"
      ? "border-rose-300/30 bg-rose-500/10 text-rose-600"
      : risk === "High"
        ? "border-amber-300/30 bg-amber-500/10 text-amber-600"
        : risk === "Moderate"
          ? "border-indigo-300/30 bg-indigo-500/10 text-indigo-600"
          : "border-slate-300/30 bg-slate-500/10 text-slate-600";
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", style)}>{risk}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}
