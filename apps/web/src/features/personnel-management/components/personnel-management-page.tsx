"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import { MOCK_PERSONNEL } from "@/features/personnel-management/mock-data";
import type { PersonnelRecord, PersonnelStatus, PersonnelType } from "@/features/personnel-management/types";

type OfficeFilter = "All" | "Office of the Punong Barangay" | "Secretariat" | "Admin Office" | "Treasury";
type TypeFilter = "All" | PersonnelType;
type StatusFilter = "All" | PersonnelStatus;

type PersonnelFormState = {
  fullName: string;
  employeeNumber: string;
  position: string;
  office: string;
  type: PersonnelType;
  status: PersonnelStatus;
  contactNumber: string;
  emailAddress: string;
  address: string;
  dateAppointed: string;
  profilePhoto: string;
  attachmentName: string;
};

const EMPTY_FORM: PersonnelFormState = {
  fullName: "",
  employeeNumber: "",
  position: "",
  office: "",
  type: "Staff",
  status: "Active",
  contactNumber: "",
  emailAddress: "",
  address: "",
  dateAppointed: "",
  profilePhoto: "",
  attachmentName: "",
};

export function PersonnelManagementPage() {
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>(MOCK_PERSONNEL);
  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState<OfficeFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PersonnelFormState>(EMPTY_FORM);

  const summary = useMemo(() => {
    const totalPersonnel = personnel.length;
    const activePersonnel = personnel.filter((p) => p.status === "Active").length;
    const electedOfficials = personnel.filter((p) => p.type === "Elected").length;
    const totalOffices = new Set(personnel.map((p) => p.office)).size;
    return { totalPersonnel, activePersonnel, electedOfficials, totalOffices };
  }, [personnel]);

  const filteredPersonnel = useMemo(
    () =>
      personnel
        .filter((p) =>
          search
            ? `${p.fullName} ${p.position} ${p.employeeNumber}`.toLowerCase().includes(search.toLowerCase())
            : true
        )
        .filter((p) => (officeFilter === "All" ? true : p.office === officeFilter))
        .filter((p) => (typeFilter === "All" ? true : p.type === typeFilter))
        .filter((p) => (statusFilter === "All" ? true : p.status === statusFilter)),
    [personnel, search, officeFilter, typeFilter, statusFilter]
  );

  function resetFilters() {
    setSearch("");
    setOfficeFilter("All");
    setTypeFilter("All");
    setStatusFilter("All");
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  }

  function openEditForm(record: PersonnelRecord) {
    setEditingId(record.id);
    setForm({
      fullName: record.fullName,
      employeeNumber: record.employeeNumber,
      position: record.position,
      office: record.office,
      type: record.type,
      status: record.status,
      contactNumber: record.contactNumber,
      emailAddress: record.emailAddress,
      address: record.address,
      dateAppointed: record.dateAppointed,
      profilePhoto: record.profilePhoto ?? "",
      attachmentName: record.attachmentName ?? "",
    });
    setIsFormOpen(true);
  }

  function savePersonnel() {
    if (!form.fullName.trim() || !form.employeeNumber.trim()) return;
    const payload: PersonnelRecord = {
      id: editingId ?? `PER-${Date.now()}`,
      fullName: form.fullName.trim(),
      employeeNumber: form.employeeNumber.trim(),
      position: form.position.trim(),
      office: form.office.trim(),
      type: form.type,
      status: form.status,
      contactNumber: form.contactNumber.trim(),
      emailAddress: form.emailAddress.trim(),
      address: form.address.trim(),
      dateAppointed: form.dateAppointed,
      profilePhoto: form.profilePhoto.trim() || undefined,
      attachmentName: form.attachmentName.trim() || undefined,
    };

    setPersonnel((prev) => {
      if (!editingId) return [payload, ...prev];
      return prev.map((p) => (p.id === editingId ? payload : p));
    });
    setIsFormOpen(false);
  }

  function toggleStatus(id: string) {
    setPersonnel((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p))
    );
  }

  function deletePersonnel(id: string) {
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Personnel Management (HRIS)</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage barangay officials, employees, and personnel records for internal HR operations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreateForm}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Personnel
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Personnel" value={String(summary.totalPersonnel)} />
          <SummaryCard label="Active Personnel" value={String(summary.activePersonnel)} />
          <SummaryCard label="Elected Officials" value={String(summary.electedOfficials)} />
          <SummaryCard label="Total Offices" value={String(summary.totalOffices)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, position, or employee number"
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </label>
          <SelectField
            label="Office"
            value={officeFilter}
            options={["All", "Office of the Punong Barangay", "Secretariat", "Admin Office", "Treasury"]}
            onChange={(v) => setOfficeFilter(v as OfficeFilter)}
          />
          <SelectField
            label="Type"
            value={typeFilter}
            options={["All", "Elected", "Staff", "Appointed"]}
            onChange={(v) => setTypeFilter(v as TypeFilter)}
          />
          <SelectField
            label="Status"
            value={statusFilter}
            options={["All", "Active", "Inactive"]}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
          />
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
              {["Full Name", "Employee Number", "Position", "Office", "Type", "Status", "Date Appointed", "Contact Number", "Actions"].map(
                (head) => (
                  <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/50">
            {filteredPersonnel.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-3 text-[var(--text)]">{record.fullName}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{record.employeeNumber}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{record.position}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{record.office}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{record.type}</td>
                <td className="px-4 py-3">
                  <StatusPill status={record.status} />
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{formatDate(record.dateAppointed)}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{record.contactNumber}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <MiniAction label="View Profile" icon={Eye} />
                    <MiniAction label="Edit" icon={Pencil} onClick={() => openEditForm(record)} />
                    <MiniAction
                      label={record.status === "Active" ? "Deactivate" : "Activate"}
                      onClick={() => toggleStatus(record.id)}
                    />
                    <MiniAction label="Delete" icon={Trash2} danger onClick={() => deletePersonnel(record.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--text)]">{editingId ? "Edit Personnel" : "Add Personnel"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]">Close</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <InputField label="Full Name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />
              <InputField label="Employee Number" value={form.employeeNumber} onChange={(v) => setForm((p) => ({ ...p, employeeNumber: v }))} />
              <InputField label="Position" value={form.position} onChange={(v) => setForm((p) => ({ ...p, position: v }))} />
              <InputField label="Office" value={form.office} onChange={(v) => setForm((p) => ({ ...p, office: v }))} />
              <SelectField
                label="Type"
                value={form.type}
                options={["Elected", "Staff", "Appointed"]}
                onChange={(v) => setForm((p) => ({ ...p, type: v as PersonnelType }))}
              />
              <SelectField
                label="Status"
                value={form.status}
                options={["Active", "Inactive"]}
                onChange={(v) => setForm((p) => ({ ...p, status: v as PersonnelStatus }))}
              />
              <InputField label="Contact Number" value={form.contactNumber} onChange={(v) => setForm((p) => ({ ...p, contactNumber: v }))} />
              <InputField label="Email Address" value={form.emailAddress} onChange={(v) => setForm((p) => ({ ...p, emailAddress: v }))} />
              <InputField label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
              <InputField label="Date Appointed" value={form.dateAppointed} onChange={(v) => setForm((p) => ({ ...p, dateAppointed: v }))} />
              <InputField label="Profile Photo (optional)" value={form.profilePhoto} onChange={(v) => setForm((p) => ({ ...p, profilePhoto: v }))} />
              <InputField label="Attachments (optional)" value={form.attachmentName} onChange={(v) => setForm((p) => ({ ...p, attachmentName: v }))} />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={savePersonnel} className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
                Save Personnel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
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

function StatusPill({ status }: { status: PersonnelStatus }) {
  const tone =
    status === "Active"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-700"
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
