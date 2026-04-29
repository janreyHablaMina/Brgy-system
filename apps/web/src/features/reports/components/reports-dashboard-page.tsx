"use client";

import { useMemo, useState } from "react";
import { BarChart3, Download, Eye, FileText, Filter, Printer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportCategory =
  | "Population & Demographics"
  | "Governance"
  | "Legal & Safety"
  | "Finance"
  | "Social Services"
  | "Disaster Management";

type ReportType = "Summary" | "Master List" | "Statistical" | "Assessment" | "Annual";

type ResidentStatus = "All" | "Active" | "Inactive" | "Transferred" | "Deceased";

type ReportTemplate = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  type: ReportType;
  dilgRequired: boolean;
};

const REPORTS: ReportTemplate[] = [
  { id: "RPT-001", title: "Barangay Profile Report", description: "Overview of barangay demographics, location, officials, and general information.", category: "Governance", type: "Summary", dilgRequired: true },
  { id: "RPT-002", title: "Resident Master List", description: "Complete list of all registered residents with basic details.", category: "Population & Demographics", type: "Master List", dilgRequired: true },
  { id: "RPT-003", title: "Household Summary Report", description: "Summary of households, family size, and housing distribution.", category: "Population & Demographics", type: "Summary", dilgRequired: false },
  { id: "RPT-004", title: "Voter Statistics Report", description: "Breakdown of registered voters by age, gender, and precinct.", category: "Governance", type: "Statistical", dilgRequired: false },
  { id: "RPT-005", title: "Establishment Master List", description: "List of all businesses and establishments within the barangay.", category: "Governance", type: "Master List", dilgRequired: false },
  { id: "RPT-006", title: "KP Case Summary", description: "Summary of Katarungang Pambarangay cases (filed, settled, ongoing).", category: "Legal & Safety", type: "Summary", dilgRequired: true },
  { id: "RPT-007", title: "Blotter Summary Report", description: "Record of incidents reported in the barangay blotter.", category: "Legal & Safety", type: "Summary", dilgRequired: true },
  { id: "RPT-008", title: "VAWC Statistical Report", description: "Data on Violence Against Women and Children cases.", category: "Social Services", type: "Statistical", dilgRequired: true },
  { id: "RPT-009", title: "Document Issuance Report", description: "Tracks all issued documents (clearances, certificates, etc.).", category: "Governance", type: "Summary", dilgRequired: false },
  { id: "RPT-010", title: "Revenue Collection Report", description: "Summary of collected fees and payments.", category: "Finance", type: "Summary", dilgRequired: true },
  { id: "RPT-011", title: "Barangay Annual Report", description: "Yearly overview of operations, achievements, and statistics.", category: "Governance", type: "Annual", dilgRequired: true },
  { id: "RPT-012", title: "Disaster Risk Assessment", description: "Report on hazard zones, risk levels, and preparedness data.", category: "Disaster Management", type: "Assessment", dilgRequired: true },
];

const CATEGORY_OPTIONS = ["All", "Population & Demographics", "Governance", "Legal & Safety", "Finance", "Social Services", "Disaster Management"] as const;
const TYPE_OPTIONS = ["All", "Summary", "Master List", "Statistical", "Assessment", "Annual"] as const;

export function ReportsDashboardPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("All");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>("All");
  const [purok, setPurok] = useState("");
  const [residentStatus, setResidentStatus] = useState<ResidentStatus>("All");
  const [applied, setApplied] = useState(false);

  const filteredReports = useMemo(() => {
    return REPORTS.filter((report) => (category === "All" ? true : report.category === category)).filter((report) =>
      type === "All" ? true : report.type === type
    );
  }, [category, type]);

  const dilgRequiredCount = useMemo(() => REPORTS.filter((item) => item.dilgRequired).length, []);

  function applyFilters() {
    setApplied(true);
  }

  function resetFilters() {
    setFromDate("");
    setToDate("");
    setCategory("All");
    setType("All");
    setPurok("");
    setResidentStatus("All");
    setApplied(false);
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Reports Dashboard</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Generate, view, and export official barangay reports for monitoring, compliance, and decision-making.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Total Templates" value={REPORTS.length} icon={FileText} tone="blue" />
          <SummaryCard label="DILG Required" value={dilgRequiredCount} icon={BarChart3} tone="amber" />
          <SummaryCard label="Categories" value={6} icon={Filter} tone="emerald" />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">From</span>
            <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40" />
          </label>
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">To</span>
            <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40" />
          </label>
          <SelectField label="Category" value={category} options={[...CATEGORY_OPTIONS]} onChange={setCategory} />
          <SelectField label="Report Type" value={type} options={[...TYPE_OPTIONS]} onChange={setType} />
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Purok / Area</span>
            <input value={purok} onChange={(e) => setPurok(e.target.value)} placeholder="Optional" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40" />
          </label>
          <SelectField
            label="Resident Status"
            value={residentStatus}
            options={["All", "Active", "Inactive", "Transferred", "Deceased"]}
            onChange={(value) => setResidentStatus(value as ResidentStatus)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={applyFilters} className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
            Apply Filters
          </button>
          <button type="button" onClick={resetFilters} className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm font-semibold text-[var(--text)]">
            Reset Filters
          </button>
          {applied ? <span className="inline-flex items-center text-xs text-[var(--muted)]">Filters applied.</span> : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Reports List</p>
        </div>
        <div className="divide-y divide-[var(--border)]/50">
          {filteredReports.map((report) => (
            <article key={report.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">{report.title}</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">{report.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">{report.category}</span>
                  <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">{report.type}</span>
                  {report.dilgRequired ? <span className="rounded-full border border-amber-300/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">DILG Required</span> : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionButton label="View" icon={Eye} />
                <ActionButton label="Download PDF" icon={Download} />
                <ActionButton label="Download Excel" icon={Download} />
                <ActionButton label="Print" icon={Printer} />
                <ActionButton label="Generate" icon={Sparkles} primary />
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "amber" | "blue";
}) {
  const toneStyle =
    tone === "emerald"
      ? "border-emerald-300/30 text-emerald-600 bg-emerald-500/5"
      : tone === "amber"
        ? "border-amber-300/30 text-amber-600 bg-amber-500/5"
        : "border-indigo-300/30 text-indigo-600 bg-indigo-500/5";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
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

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionButton({
  label,
  icon: Icon,
  primary = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-all",
        primary
          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
          : "border-[var(--border)] bg-[var(--card-soft)] text-[var(--text)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
