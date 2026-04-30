"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import {
  MOCK_BUDGETS,
  MOCK_CASHBOOK,
  MOCK_COLLECTIONS,
  MOCK_DISBURSEMENTS,
} from "@/features/finance-management/mock-data";
import type {
  BudgetRecord,
  BudgetStatus,
  CashbookEntry,
  CollectionRecord,
  DisbursementRecord,
} from "@/features/finance-management/types";

type TabKey = "budgets" | "disbursements" | "cashbook" | "collections";

export function FinanceManagementPage() {
  const [tab, setTab] = useState<TabKey>("budgets");
  const [budgets, setBudgets] = useState<BudgetRecord[]>(MOCK_BUDGETS);
  const [disbursements] = useState<DisbursementRecord[]>(MOCK_DISBURSEMENTS);
  const [cashbook] = useState<CashbookEntry[]>(MOCK_CASHBOOK);
  const [collections] = useState<CollectionRecord[]>(MOCK_COLLECTIONS);

  const [yearFilter, setYearFilter] = useState<"All" | "2026" | "2025">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | BudgetStatus>("All");

  const summary = useMemo(() => {
    const totalBudget = budgets.reduce((sum, item) => sum + item.appropriation, 0);
    const totalExpenditures = disbursements.reduce((sum, item) => sum + item.amount, 0);
    const totalCollections = collections.reduce((sum, item) => sum + item.amount, 0);
    const cashBalance = cashbook.at(-1)?.runningBalance ?? 0;
    return { totalBudget, totalExpenditures, totalCollections, cashBalance };
  }, [budgets, disbursements, collections, cashbook]);

  const filteredBudgets = useMemo(
    () =>
      budgets
        .filter((item) => (yearFilter === "All" ? true : String(item.fiscalYear) === yearFilter))
        .filter((item) => (statusFilter === "All" ? true : item.status === statusFilter)),
    [budgets, yearFilter, statusFilter]
  );

  function resetFilters() {
    setYearFilter("All");
    setStatusFilter("All");
  }

  function closeBudget(id: string) {
    setBudgets((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Closed" } : item)));
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Finance Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage budgets, disbursements, collections, and cashbook records for internal finance operations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Add Budget
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Budget" value={peso(summary.totalBudget)} />
          <SummaryCard label="Total Expenditures" value={peso(summary.totalExpenditures)} />
          <SummaryCard label="Total Collections" value={peso(summary.totalCollections)} />
          <SummaryCard label="Cash Balance" value={peso(summary.cashBalance)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectField label="Filter by Year" value={yearFilter} options={["All", "2026", "2025"]} onChange={(v) => setYearFilter(v as "All" | "2026" | "2025")} />
          <SelectField label="Filter by Status" value={statusFilter} options={["All", "Active", "Closed"]} onChange={(v) => setStatusFilter(v as "All" | BudgetStatus)} />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] p-3">
          <TabButton label="Budgets" active={tab === "budgets"} onClick={() => setTab("budgets")} />
          <TabButton label="Disbursements" active={tab === "disbursements"} onClick={() => setTab("disbursements")} />
          <TabButton label="Cashbook" active={tab === "cashbook"} onClick={() => setTab("cashbook")} />
          <TabButton label="Collections" active={tab === "collections"} onClick={() => setTab("collections")} />
        </div>

        {tab === "budgets" ? (
          <div className="p-4">
            <SimpleTable
              headers={["FY", "Appropriation", "Allotment", "Obligations", "Unobligated Balance", "Status", "Actions"]}
              rows={filteredBudgets.map((b) => [
                String(b.fiscalYear),
                peso(b.appropriation),
                peso(b.allotment),
                peso(b.obligations),
                peso(b.unobligatedBalance),
                b.status,
                b.status === "Active" ? `Add Budget / Edit Budget / View Details / Close Budget (${b.id})` : "View Details",
              ])}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {filteredBudgets
                .filter((b) => b.status === "Active")
                .map((b) => (
                  <MiniAction key={b.id} label={`Close ${b.id}`} onClick={() => closeBudget(b.id)} />
                ))}
            </div>
          </div>
        ) : null}

        {tab === "disbursements" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Disbursement" />
            </div>
            <SimpleTable
              headers={["Date", "Amount", "Category", "Description", "Approved By", "Actions"]}
              rows={disbursements.map((d) => [
                formatDate(d.date),
                peso(d.amount),
                d.category,
                d.description,
                d.approvedBy,
                "View Details / Edit / Delete",
              ])}
            />
          </div>
        ) : null}

        {tab === "cashbook" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end gap-2">
              <MiniAction label="Add Entry" />
              <MiniAction label="View History" />
            </div>
            <SimpleTable
              headers={["Date", "Transaction Type", "Description", "Amount", "Running Balance", "Actions"]}
              rows={cashbook.map((c) => [
                formatDate(c.date),
                c.transactionType,
                c.description,
                peso(c.amount),
                peso(c.runningBalance),
                "Edit Entry",
              ])}
            />
          </div>
        ) : null}

        {tab === "collections" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Collection" />
            </div>
            <SimpleTable
              headers={["Date", "Source", "Amount", "Collected By", "Reference Number", "Actions"]}
              rows={collections.map((c) => [
                formatDate(c.date),
                c.source,
                peso(c.amount),
                c.collectedBy,
                c.referenceNumber,
                "View Details / Edit / Delete",
              ])}
            />
          </div>
        ) : null}
      </section>
    </section>
  );
}

function peso(amount: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(amount);
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold",
        active ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
      )}
    >
      {label}
    </button>
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
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center rounded-lg border border-[var(--border)] px-2 text-xs font-semibold text-[var(--text)]"
    >
      {label}
    </button>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
            {headers.map((head) => (
              <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/50">
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i} className={cn("px-4 py-3", i === row.length - 1 ? "text-[var(--text)]" : "text-[var(--muted)]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
