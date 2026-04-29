"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import { MOCK_GAD_PLANS } from "@/features/gad-management/mock-data";
import type { GadPlan, GadPlanStatus } from "@/features/gad-management/types";

type StatusFilter = "All" | GadPlanStatus;
type YearFilter = "All" | "2026" | "2025";

type PlanFormState = {
  planTitle: string;
  description: string;
  targetBeneficiaries: string;
  budgetAllocation: string;
  year: string;
  status: GadPlanStatus;
  attachmentName: string;
};

const EMPTY_FORM: PlanFormState = {
  planTitle: "",
  description: "",
  targetBeneficiaries: "",
  budgetAllocation: "",
  year: "2026",
  status: "Draft",
  attachmentName: "",
};

export function GadManagementPage() {
  const [plans, setPlans] = useState<GadPlan[]>(MOCK_GAD_PLANS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [yearFilter, setYearFilter] = useState<YearFilter>("All");
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);

  const filteredPlans = useMemo(
    () =>
      plans
        .filter((item) => (statusFilter === "All" ? true : item.status === statusFilter))
        .filter((item) => (yearFilter === "All" ? true : String(item.year) === yearFilter))
        .filter((item) =>
          search ? item.planTitle.toLowerCase().includes(search.toLowerCase()) : true
        ),
    [plans, statusFilter, yearFilter, search]
  );

  const summary = useMemo(() => {
    const totalPlans = plans.length;
    const totalBudget = plans.reduce((sum, item) => sum + item.budgetAllocation, 0);
    const approved = plans.filter((item) => item.status === "Approved").length;
    const draftOrSubmitted = plans.filter((item) => item.status === "Draft" || item.status === "Submitted").length;
    return { totalPlans, totalBudget, approved, draftOrSubmitted };
  }, [plans]);

  function resetFilters() {
    setStatusFilter("All");
    setYearFilter("All");
    setSearch("");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  }

  function openEditForm(plan: GadPlan) {
    setEditingId(plan.id);
    setForm({
      planTitle: plan.planTitle,
      description: plan.description,
      targetBeneficiaries: plan.targetBeneficiaries,
      budgetAllocation: String(plan.budgetAllocation),
      year: String(plan.year),
      status: plan.status,
      attachmentName: plan.attachmentName ?? "",
    });
    setIsFormOpen(true);
  }

  function savePlan() {
    if (!form.planTitle.trim() || !form.description.trim()) return;

    const now = new Date().toISOString().slice(0, 10);
    const payload: GadPlan = {
      id: editingId ?? `GAD-${form.year}-${Date.now().toString().slice(-3)}`,
      planTitle: form.planTitle.trim(),
      description: form.description.trim(),
      targetBeneficiaries: form.targetBeneficiaries.trim(),
      budgetAllocation: Number(form.budgetAllocation || 0),
      year: Number(form.year),
      status: form.status,
      dateCreated: editingId ? plans.find((p) => p.id === editingId)?.dateCreated ?? now : now,
      lastUpdated: now,
      attachmentName: form.attachmentName.trim() || undefined,
    };

    setPlans((prev) => {
      if (!editingId) return [payload, ...prev];
      return prev.map((item) => (item.id === editingId ? payload : item));
    });
    setIsFormOpen(false);
  }

  function updatePlanStatus(id: string, next: GadPlanStatus) {
    setPlans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: next, lastUpdated: new Date().toISOString().slice(0, 10) } : item
      )
    );
  }

  function deletePlan(id: string) {
    setPlans((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">GAD Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage GAD plans, allocations, implementation status, and compliance reporting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreateForm}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add GAD Plan
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Generate GAD Report
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total GAD Plans" value={String(summary.totalPlans)} />
          <SummaryCard label="Total Budget Allocation" value={peso(summary.totalBudget)} />
          <SummaryCard label="Approved Plans" value={String(summary.approved)} />
          <SummaryCard label="Draft / Submitted Plans" value={String(summary.draftOrSubmitted)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Status"
            value={statusFilter}
            options={["All", "Draft", "Submitted", "Approved", "Implemented"]}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
          />
          <SelectField
            label="Year"
            value={yearFilter}
            options={["All", "2026", "2025"]}
            onChange={(v) => setYearFilter(v as YearFilter)}
          />
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search by Plan Title</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
              {["Plan Title", "Description", "Year", "Budget Allocation", "Status", "Date Created", "Last Updated", "Actions"].map(
                (head) => (
                  <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/50">
            {filteredPlans.map((plan) => (
              <tr key={plan.id}>
                <td className="px-4 py-3 text-[var(--text)]">{plan.planTitle}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{plan.description}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{plan.year}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{peso(plan.budgetAllocation)}</td>
                <td className="px-4 py-3">
                  <StatusPill status={plan.status} />
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{formatDate(plan.dateCreated)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{formatDate(plan.lastUpdated)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <MiniAction label="Edit" icon={Pencil} onClick={() => openEditForm(plan)} />
                    {plan.status === "Draft" ? (
                      <MiniAction label="Submit" onClick={() => updatePlanStatus(plan.id, "Submitted")} />
                    ) : null}
                    {plan.status === "Submitted" ? (
                      <MiniAction label="Approve" onClick={() => updatePlanStatus(plan.id, "Approved")} />
                    ) : null}
                    {plan.status === "Approved" ? (
                      <MiniAction label="Implement" onClick={() => updatePlanStatus(plan.id, "Implemented")} />
                    ) : null}
                    <MiniAction label="Delete" icon={Trash2} danger onClick={() => deletePlan(plan.id)} />
                    <MiniAction label="Report" icon={FileText} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--text)]">{editingId ? "Edit GAD Plan" : "Add GAD Plan"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]">Close</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <InputField label="Plan Title" value={form.planTitle} onChange={(v) => setForm((p) => ({ ...p, planTitle: v }))} />
              <InputField label="Target Beneficiaries" value={form.targetBeneficiaries} onChange={(v) => setForm((p) => ({ ...p, targetBeneficiaries: v }))} />
              <InputField label="Budget Allocation" value={form.budgetAllocation} onChange={(v) => setForm((p) => ({ ...p, budgetAllocation: v }))} />
              <InputField label="Year" value={form.year} onChange={(v) => setForm((p) => ({ ...p, year: v }))} />
              <SelectField
                label="Status"
                value={form.status}
                options={["Draft", "Submitted", "Approved", "Implemented"]}
                onChange={(v) => setForm((p) => ({ ...p, status: v as GadPlanStatus }))}
              />
              <InputField
                label="Attachments (optional)"
                value={form.attachmentName}
                onChange={(v) => setForm((p) => ({ ...p, attachmentName: v }))}
              />
              <label className="md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="mt-1 h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={savePlan} className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
                Save Plan
              </button>
            </div>
          </div>
        </div>
      ) : null}
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

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      />
    </label>
  );
}

function StatusPill({ status }: { status: GadPlanStatus }) {
  const tone =
    status === "Approved" || status === "Implemented"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-700"
      : status === "Submitted"
        ? "border-indigo-300/30 bg-indigo-500/10 text-indigo-700"
        : "border-slate-300/30 bg-slate-500/10 text-slate-700";
  return <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", tone)}>{status}</span>;
}

function MiniAction({
  label,
  icon: Icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-xs font-semibold",
        danger ? "border-rose-300/30 bg-rose-500/10 text-rose-700" : "border-[var(--border)] text-[var(--text)]"
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </button>
  );
}
