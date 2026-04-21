"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Archive,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CivilStatus,
  Resident,
  ResidentFilters,
  ResidentFormInput,
  ResidentGender,
  ResidentStatus,
  SortBy,
  SortDirection,
  UserRole,
} from "../types";
import {
  computeAge,
  downloadCsv,
  downloadExcelCompatible,
  formatDate,
  generateResidentId,
  getFullName,
  getTimestamp,
  matchesResidentFilters,
  matchesResidentSearch,
  toCsvRows,
  validateResidentInput,
} from "../utils";

const STATUS_OPTIONS: Array<"All" | ResidentStatus> = ["All", "Active", "Inactive", "Deceased"];
const GENDER_OPTIONS: Array<"All" | ResidentGender> = ["All", "Male", "Female", "Other"];
const CIVIL_STATUS_OPTIONS: Array<"All" | CivilStatus> = ["All", "Single", "Married", "Widowed", "Separated"];
const AGE_GROUP_OPTIONS = ["All", "Child", "Adult", "Senior"] as const;

const SEED_RESIDENTS: Resident[] = [
  {
    id: "RES-2026-0001",
    firstName: "Maria",
    middleName: "Lopez",
    lastName: "Santos",
    birthdate: "1962-04-12",
    gender: "Female",
    civilStatus: "Married",
    address: "Purok 1, Brgy. Salaza",
    contactNumber: "09171234567",
    email: "maria.santos@example.com",
    status: "Active",
    tags: { senior: true, pwd: false, voter: true },
    dateRegistered: "2023-01-15",
    lastUpdated: "2026-04-12",
    householdInfo: "Household #H-102, 4 members",
    documentHistory: ["Barangay Clearance - Jan 2026", "Residency Certificate - Dec 2025"],
    requestHistory: ["Requested business permit endorsement - Feb 2026"],
  },
  {
    id: "RES-2026-0002",
    firstName: "Juan",
    middleName: "Reyes",
    lastName: "Dela Cruz",
    birthdate: "1998-11-03",
    gender: "Male",
    civilStatus: "Single",
    address: "Purok 2, Brgy. Salaza",
    contactNumber: "09981234567",
    email: "juan.delacruz@example.com",
    status: "Active",
    tags: { senior: false, pwd: false, voter: true },
    dateRegistered: "2024-02-04",
    lastUpdated: "2026-03-29",
    householdInfo: "Household #H-220, 3 members",
    documentHistory: ["NBI Referral - Mar 2026"],
    requestHistory: ["Requested indigency certificate - Mar 2026"],
  },
  {
    id: "RES-2026-0003",
    firstName: "Ana",
    middleName: "Garcia",
    lastName: "Reyes",
    birthdate: "1985-07-18",
    gender: "Female",
    civilStatus: "Married",
    address: "Purok 3, Brgy. Salaza",
    status: "Inactive",
    tags: { senior: false, pwd: true, voter: true },
    dateRegistered: "2022-05-21",
    lastUpdated: "2026-01-09",
    documentHistory: ["PWD Verification - Jan 2026"],
    requestHistory: ["Updated profile details - Jan 2026"],
  },
  {
    id: "RES-2026-0004",
    firstName: "Pedro",
    middleName: "Cruz",
    lastName: "Luna",
    birthdate: "1948-02-02",
    gender: "Male",
    civilStatus: "Widowed",
    address: "Purok 1, Brgy. Salaza",
    status: "Active",
    tags: { senior: true, pwd: true, voter: true },
    dateRegistered: "2021-08-10",
    lastUpdated: "2026-03-02",
    documentHistory: ["Senior Citizen Certification - Mar 2026"],
    requestHistory: ["Medicine assistance request - Feb 2026"],
  },
  {
    id: "RES-2026-0005",
    firstName: "Carla",
    middleName: "Mendoza",
    lastName: "Rivera",
    birthdate: "2009-10-22",
    gender: "Female",
    civilStatus: "Single",
    address: "Purok 4, Brgy. Salaza",
    status: "Active",
    tags: { senior: false, pwd: false, voter: false },
    dateRegistered: "2025-08-01",
    lastUpdated: "2026-04-01",
    documentHistory: ["School Residency Request - Apr 2026"],
    requestHistory: ["Requested student certificate - Apr 2026"],
  },
  {
    id: "RES-2026-0006",
    firstName: "Liza",
    middleName: "Torres",
    lastName: "Gonzales",
    birthdate: "1992-03-14",
    gender: "Female",
    civilStatus: "Separated",
    address: "Purok 5, Brgy. Salaza",
    status: "Deceased",
    tags: { senior: false, pwd: false, voter: true },
    dateRegistered: "2020-06-18",
    lastUpdated: "2025-12-20",
    documentHistory: ["Civil registry update - Dec 2025"],
    requestHistory: ["Status archived - Dec 2025"],
  },
  {
    id: "RES-2026-0007",
    firstName: "Mark",
    middleName: "Lim",
    lastName: "Aquino",
    birthdate: "2001-09-05",
    gender: "Male",
    civilStatus: "Single",
    address: "Purok 2, Brgy. Salaza",
    status: "Active",
    tags: { senior: false, pwd: false, voter: true },
    dateRegistered: "2024-11-07",
    lastUpdated: "2026-04-14",
    documentHistory: ["Barangay ID Renewal - Apr 2026"],
    requestHistory: ["Requested certificate of residency - Apr 2026"],
  },
  {
    id: "RES-2026-0008",
    firstName: "Rosa",
    middleName: "Diaz",
    lastName: "Navarro",
    birthdate: "1959-01-30",
    gender: "Female",
    civilStatus: "Married",
    address: "Purok 3, Brgy. Salaza",
    status: "Active",
    tags: { senior: true, pwd: false, voter: true },
    dateRegistered: "2023-09-09",
    lastUpdated: "2026-04-03",
    documentHistory: ["Senior validation - Apr 2026"],
    requestHistory: ["Requested livelihood support - Mar 2026"],
  },
];

const EMPTY_FILTERS: ResidentFilters = {
  status: "All",
  gender: "All",
  civilStatus: "All",
  ageGroup: "All",
  seniorOnly: false,
  pwdOnly: false,
  voterOnly: false,
  registeredFrom: "",
  registeredTo: "",
};

const EMPTY_FORM: ResidentFormInput = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthdate: "",
  gender: "Male",
  address: "",
  contactNumber: "",
  email: "",
  civilStatus: "Single",
  tags: { senior: false, pwd: false, voter: false },
  householdInfo: "",
};

type ModalMode = "create" | "edit";

export function ResidentsManagementPage() {
  const [role, setRole] = useState<UserRole>("Admin");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ResidentFilters>(EMPTY_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<ResidentStatus>("Active");

  const [viewResident, setViewResident] = useState<Resident | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ModalMode>("create");
  const [formInput, setFormInput] = useState<ResidentFormInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ResidentFormInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResidents(SEED_RESIDENTS);
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

  const activeResidents = useMemo(() => residents.filter((resident) => !resident.deletedAt), [residents]);

  const processedResidents = useMemo(() => {
    const filtered = activeResidents
      .filter((resident) => matchesResidentSearch(resident, searchQuery))
      .filter((resident) => matchesResidentFilters(resident, filters));

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        const first = getFullName(a).toLowerCase();
        const second = getFullName(b).toLowerCase();
        return sortDirection === "asc" ? first.localeCompare(second) : second.localeCompare(first);
      }

      if (sortBy === "age") {
        const first = computeAge(a.birthdate);
        const second = computeAge(b.birthdate);
        return sortDirection === "asc" ? first - second : second - first;
      }

      const first = new Date(a.dateRegistered).getTime();
      const second = new Date(b.dateRegistered).getTime();
      return sortDirection === "asc" ? first - second : second - first;
    });

    return sorted;
  }, [activeResidents, filters, searchQuery, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(processedResidents.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedResidents = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return processedResidents.slice(start, start + rowsPerPage);
  }, [safeCurrentPage, processedResidents, rowsPerPage]);

  const metrics = useMemo(() => {
    const total = activeResidents.length;
    const seniors = activeResidents.filter((resident) => resident.tags.senior).length;
    const pwd = activeResidents.filter((resident) => resident.tags.pwd).length;
    const voters = activeResidents.filter((resident) => resident.tags.voter).length;
    return { total, seniors, pwd, voters };
  }, [activeResidents]);

  const selectedCount = selectedIds.size;
  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (filters.status !== "All") labels.push(filters.status);
    if (filters.gender !== "All") labels.push(filters.gender);
    if (filters.civilStatus !== "All") labels.push(filters.civilStatus);
    if (filters.ageGroup !== "All") labels.push(filters.ageGroup);
    if (filters.seniorOnly) labels.push("Senior");
    if (filters.pwdOnly) labels.push("PWD");
    if (filters.voterOnly) labels.push("Voter");
    if (filters.registeredFrom) labels.push(`From ${formatDate(filters.registeredFrom)}`);
    if (filters.registeredTo) labels.push(`To ${formatDate(filters.registeredTo)}`);
    return labels;
  }, [filters]);

  const allVisibleSelected =
    paginatedResidents.length > 0 && paginatedResidents.every((resident) => selectedIds.has(resident.id));

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setCurrentPage(1);
  }

  function toggleSelectRow(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectVisibleRows() {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        paginatedResidents.forEach((resident) => next.delete(resident.id));
      } else {
        paginatedResidents.forEach((resident) => next.add(resident.id));
      }
      return next;
    });
  }

  function softDeleteByIds(ids: string[]) {
    const now = getTimestamp();
    setResidents((previous) =>
      previous.map((resident) =>
        ids.includes(resident.id)
          ? { ...resident, deletedAt: now, status: "Inactive", lastUpdated: now }
          : resident
      )
    );
    setSelectedIds((previous) => {
      const next = new Set(previous);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  function handleBulkDelete() {
    if (role !== "Admin" || selectedCount === 0) {
      return;
    }

    softDeleteByIds(Array.from(selectedIds));
  }

  function handleBulkStatusUpdate() {
    if (selectedCount === 0) {
      return;
    }

    const now = getTimestamp();
    setResidents((previous) =>
      previous.map((resident) =>
        selectedIds.has(resident.id) ? { ...resident, status: bulkStatus, lastUpdated: now } : resident
      )
    );
  }

  function exportResidents(scope: "all" | "filtered" | "selected", format: "csv" | "excel") {
    const source =
      scope === "all"
        ? activeResidents
        : scope === "filtered"
          ? processedResidents
          : activeResidents.filter((resident) => selectedIds.has(resident.id));

    if (source.length === 0) {
      return;
    }

    const rows = toCsvRows(source);
    if (format === "csv") {
      downloadCsv(`residents-${scope}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
      return;
    }

    downloadExcelCompatible(`residents-${scope}-${new Date().toISOString().slice(0, 10)}.xls`, rows);
  }

  function openCreateModal() {
    setFormMode("create");
    setEditingResident(null);
    setFormInput(EMPTY_FORM);
    setFormErrors({});
    setServerError(null);
    setIsFormOpen(true);
  }

  function openEditModal(resident: Resident) {
    setFormMode("edit");
    setEditingResident(resident);
    setFormInput({
      firstName: resident.firstName,
      middleName: resident.middleName ?? "",
      lastName: resident.lastName,
      birthdate: resident.birthdate,
      gender: resident.gender,
      address: resident.address,
      contactNumber: resident.contactNumber ?? "",
      email: resident.email ?? "",
      civilStatus: resident.civilStatus,
      tags: resident.tags,
      householdInfo: resident.householdInfo ?? "",
    });
    setFormErrors({});
    setServerError(null);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setServerError(null);
    setFormErrors({});
  }

  function setFormValue<K extends keyof ResidentFormInput>(key: K, value: ResidentFormInput[K]) {
    setFormInput((previous) => ({ ...previous, [key]: value }));
  }

  function saveResident() {
    const errors = validateResidentInput(formInput);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (formInput.firstName.trim().toLowerCase() === "error") {
      setServerError("Server error: Unable to save resident right now. Please try again.");
      return;
    }

    const now = getTimestamp();
    const age = computeAge(formInput.birthdate);
    const computedSenior = age >= 60 || formInput.tags.senior;
    const payloadBase = {
      firstName: formInput.firstName.trim(),
      middleName: formInput.middleName.trim() || undefined,
      lastName: formInput.lastName.trim(),
      birthdate: formInput.birthdate,
      gender: formInput.gender,
      civilStatus: formInput.civilStatus,
      address: formInput.address.trim(),
      contactNumber: formInput.contactNumber.trim() || undefined,
      email: formInput.email.trim() || undefined,
      tags: {
        ...formInput.tags,
        senior: computedSenior,
      },
      householdInfo: formInput.householdInfo.trim() || undefined,
      lastUpdated: now,
    };

    if (formMode === "create") {
      const newResident: Resident = {
        id: generateResidentId(residents),
        ...payloadBase,
        status: "Active",
        dateRegistered: now,
        documentHistory: ["Profile created"],
        requestHistory: [],
      };

      setResidents((previous) => [newResident, ...previous]);
    } else if (editingResident) {
      setResidents((previous) =>
        previous.map((resident) =>
          resident.id === editingResident.id
            ? {
                ...resident,
                ...payloadBase,
              }
            : resident
        )
      );
    }

    closeFormModal();
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
        <div className="h-96 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">
        <h2 className="text-lg font-semibold">Unable to load residents</h2>
        <p className="mt-1 text-sm">{fetchError}</p>
        <button
          type="button"
          className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
          onClick={() => {
            setFetchError(null);
            setLoading(true);
            setTimeout(() => {
              setResidents(SEED_RESIDENTS);
              setLoading(false);
            }, 500);
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Residents List</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage resident profiles, tags, and records with searchable and auditable actions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-[var(--primary)]/10"
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Add Resident
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Residents"
            value={metrics.total}
            description="All registered residents"
            icon={Users}
            color="blue"
          />
          <MetricCard
            label="Seniors"
            value={metrics.seniors}
            description="60 years old and above"
            icon={User}
            color="emerald"
          />
          <MetricCard
            label="PWD"
            value={metrics.pwd}
            description="Persons with Disability"
            icon={Accessibility}
            color="violet"
          />
          <MetricCard
            label="Voters"
            value={metrics.voters}
            description="Registered voters"
            icon={Archive}
            color="amber"
          />
        </div>
      </header>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <SlidersHorizontal className="h-4 w-4 text-[var(--primary)]" />
          Search and Filters
        </div>
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="relative lg:col-span-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search residents, ID, address..."
              className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] pl-10 pr-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:col-span-9">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    status: status as ResidentFilters["status"],
                  }))
                }
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  filters.status === status
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] bg-[var(--card-soft)] text-[var(--text)] hover:bg-[var(--card)]"
                }`}
              >
                {status}
              </button>
            ))}

            <TagToggle
              label="Senior"
              checked={filters.seniorOnly}
              onChange={(checked) => setFilters((prev) => ({ ...prev, seniorOnly: checked }))}
            />
            <TagToggle
              label="PWD"
              checked={filters.pwdOnly}
              onChange={(checked) => setFilters((prev) => ({ ...prev, pwdOnly: checked }))}
            />
            <TagToggle
              label="Voter"
              checked={filters.voterOnly}
              onChange={(checked) => setFilters((prev) => ({ ...prev, voterOnly: checked }))}
            />

            <button
              type="button"
              onClick={() => setShowAdvancedFilters((value) => !value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card)]"
            >
              Filters {showAdvancedFilters ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="mt-3 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-3 lg:grid-cols-4">
            <SelectFilter
              label="Gender"
              value={filters.gender}
              onChange={(value) => setFilters((prev) => ({ ...prev, gender: value as ResidentFilters["gender"] }))}
              options={GENDER_OPTIONS}
            />
            <SelectFilter
              label="Civil Status"
              value={filters.civilStatus}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, civilStatus: value as ResidentFilters["civilStatus"] }))
              }
              options={CIVIL_STATUS_OPTIONS}
            />
            <SelectFilter
              label="Age Group"
              value={filters.ageGroup}
              onChange={(value) => setFilters((prev) => ({ ...prev, ageGroup: value as ResidentFilters["ageGroup"] }))}
              options={[...AGE_GROUP_OPTIONS]}
            />
            <div className="grid gap-2">
              <label className="text-xs font-medium text-[var(--muted)]">
                Registered From
                <input
                  type="date"
                  value={filters.registeredFrom}
                  onChange={(event) => setFilters((prev) => ({ ...prev, registeredFrom: event.target.value }))}
                  className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 text-[var(--text)]"
                />
              </label>
              <label className="text-xs font-medium text-[var(--muted)]">
                Registered To
                <input
                  type="date"
                  value={filters.registeredTo}
                  onChange={(event) => setFilters((prev) => ({ ...prev, registeredTo: event.target.value }))}
                  className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 text-[var(--text)]"
                />
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]"
          >
            Reset Filters
          </button>
          {activeFilterLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text)]"
            >
              {label}
            </span>
          ))}

          <SortControl
            sortBy={sortBy}
            sortDirection={sortDirection}
            setSortBy={setSortBy}
            setSortDirection={setSortDirection}
          />

          <button
            type="button"
            onClick={() => exportResidents("all", "csv")}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]"
          >
            <Download className="h-3.5 w-3.5" /> Export All CSV
          </button>
          <button
            type="button"
            onClick={() => exportResidents("filtered", "excel")}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]"
          >
            <Download className="h-3.5 w-3.5" /> Export Filtered Excel
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--card-soft)]/70 px-5 py-4">
          <div className="text-sm text-[var(--muted)]">
            Total Records: <span className="font-semibold text-[var(--text)]">{processedResidents.length}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--muted)]">Selected: {selectedCount}</span>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={selectedCount === 0 || role !== "Admin"}
              className="rounded-xl border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => exportResidents("selected", "csv")}
              disabled={selectedCount === 0}
              className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Selected
            </button>
            <select
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value as ResidentStatus)}
              className="h-8 rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 text-xs text-[var(--text)]"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Deceased</option>
            </select>
            <button
              type="button"
              onClick={handleBulkStatusUpdate}
              disabled={selectedCount === 0}
              className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply Status
            </button>
          </div>
        </div>

        {activeResidents.length === 0 ? (
          <EmptyState
            title="No resident data yet"
            description="Add your first resident profile to start building the registry."
          />
        ) : processedResidents.length === 0 ? (
          <EmptyState title="No results found" description="Try a different search term or reset filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)] text-left text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] backdrop-blur">
                    <th className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectVisibleRows}
                        aria-label="Select all visible residents"
                      />
                    </th>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Full Name</th>
                    <th className="px-3 py-2">Age</th>
                    <th className="px-3 py-2">Gender</th>
                    <th className="px-3 py-2">Civil Status</th>
                    <th className="px-3 py-2">Address</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Tags</th>
                    <th className="px-3 py-2">Date Registered</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResidents.map((resident) => {
                    const age = computeAge(resident.birthdate);
                    return (
                      <tr key={resident.id} className="border-b border-[var(--border)] text-[var(--text)] transition hover:bg-[var(--card-soft)]/70">
                        <td className="px-3 py-2 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(resident.id)}
                            onChange={() => toggleSelectRow(resident.id)}
                            aria-label={`Select ${getFullName(resident)}`}
                          />
                        </td>
                        <td className="px-3 py-2">{resident.id}</td>
                        <td className="px-3 py-2 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--card-soft)] text-[10px] font-bold text-[var(--text)]">
                              {resident.firstName.charAt(0)}
                              {resident.lastName.charAt(0)}
                            </span>
                            <span>{getFullName(resident)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">{age}</td>
                        <td className="px-3 py-2">{resident.gender}</td>
                        <td className="px-3 py-2">{resident.civilStatus}</td>
                        <td className="px-3 py-2">{resident.address}</td>
                        <td className="px-3 py-2">
                          <StatusBadge status={resident.status} />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {resident.tags.senior ? <TagBadge label="Senior" /> : null}
                            {resident.tags.pwd ? <TagBadge label="PWD" /> : null}
                            {resident.tags.voter ? <TagBadge label="Voter" /> : null}
                          </div>
                        </td>
                        <td className="px-3 py-2">{formatDate(resident.dateRegistered)}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewResident(resident)}
                              className="rounded-lg border border-transparent p-1.5 text-[var(--muted)] transition hover:border-[var(--border)] hover:bg-[var(--card-soft)] hover:text-[var(--primary)]"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(resident)}
                              className="rounded-lg border border-transparent p-1.5 text-[var(--muted)] transition hover:border-[var(--border)] hover:bg-[var(--card-soft)] hover:text-[var(--primary)]"
                              aria-label="Edit resident"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => softDeleteByIds([resident.id])}
                              disabled={role !== "Admin"}
                              className="rounded-lg border border-transparent p-1.5 text-rose-500 transition hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Delete resident"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="text-xs text-[var(--muted)]">
                Page {safeCurrentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[var(--muted)]">
                  Rows
                  <select
                    value={rowsPerPage}
                    onChange={(event) => {
                      setRowsPerPage(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[var(--text)]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                  disabled={safeCurrentPage === 1}
                  className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, Math.min(value, totalPages) + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {isFormOpen ? (
        <ModalLayout title={formMode === "create" ? "Add Resident" : "Edit Resident"} onClose={closeFormModal}>
          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              label="First Name *"
              value={formInput.firstName}
              onChange={(value) => setFormValue("firstName", value)}
              error={formErrors.firstName}
            />
            <InputField
              label="Last Name *"
              value={formInput.lastName}
              onChange={(value) => setFormValue("lastName", value)}
              error={formErrors.lastName}
            />
            <InputField
              label="Middle Name"
              value={formInput.middleName}
              onChange={(value) => setFormValue("middleName", value)}
            />
            <InputField
              label="Birthdate *"
              type="date"
              value={formInput.birthdate}
              onChange={(value) => setFormValue("birthdate", value)}
              error={formErrors.birthdate}
            />
            <SelectField
              label="Gender *"
              value={formInput.gender}
              onChange={(value) => setFormValue("gender", value as ResidentGender)}
              options={["Male", "Female", "Other"]}
              error={formErrors.gender}
            />
            <SelectField
              label="Civil Status"
              value={formInput.civilStatus}
              onChange={(value) => setFormValue("civilStatus", value as CivilStatus)}
              options={["Single", "Married", "Widowed", "Separated"]}
            />
            <InputField
              label="Address *"
              value={formInput.address}
              onChange={(value) => setFormValue("address", value)}
              error={formErrors.address}
              className="md:col-span-2"
            />
            <InputField
              label="Contact Number"
              value={formInput.contactNumber}
              onChange={(value) => setFormValue("contactNumber", value)}
              error={formErrors.contactNumber}
            />
            <InputField
              label="Email"
              value={formInput.email}
              onChange={(value) => setFormValue("email", value)}
              error={formErrors.email}
            />
            <InputField
              label="Household Info"
              value={formInput.householdInfo}
              onChange={(value) => setFormValue("householdInfo", value)}
              className="md:col-span-2"
            />
          </div>

          <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <TagToggle
                label="Senior (auto if age 60+)"
                checked={formInput.tags.senior || (formInput.birthdate ? computeAge(formInput.birthdate) >= 60 : false)}
                onChange={(checked) => setFormValue("tags", { ...formInput.tags, senior: checked })}
              />
              <TagToggle
                label="PWD"
                checked={formInput.tags.pwd}
                onChange={(checked) => setFormValue("tags", { ...formInput.tags, pwd: checked })}
              />
              <TagToggle
                label="Voter"
                checked={formInput.tags.voter}
                onChange={(checked) => setFormValue("tags", { ...formInput.tags, voter: checked })}
              />
            </div>
          </div>

          {serverError ? <p className="mt-3 text-xs font-medium text-rose-600">{serverError}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeFormModal}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveResident}
              className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white"
            >
              Save
            </button>
          </div>
        </ModalLayout>
      ) : null}

      {viewResident ? (
        <ModalLayout title="Resident Details" onClose={() => setViewResident(null)}>
          <div className="grid gap-3 text-sm text-[var(--text)] md:grid-cols-2">
            <DetailLine label="Resident ID" value={viewResident.id} />
            <DetailLine label="Full Name" value={getFullName(viewResident)} />
            <DetailLine
              label="Birthdate"
              value={`${formatDate(viewResident.birthdate)} (${computeAge(viewResident.birthdate)} years old)`}
            />
            <DetailLine label="Gender" value={viewResident.gender} />
            <DetailLine label="Civil Status" value={viewResident.civilStatus} />
            <DetailLine label="Address" value={viewResident.address} />
            <DetailLine label="Status" value={viewResident.status} />
            <DetailLine label="Date Registered" value={formatDate(viewResident.dateRegistered)} />
            <DetailLine label="Last Updated" value={formatDate(viewResident.lastUpdated)} />
            <DetailLine label="Household Info" value={viewResident.householdInfo ?? "N/A"} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {viewResident.tags.senior ? <TagBadge label="Senior Citizen" /> : null}
            {viewResident.tags.pwd ? <TagBadge label="PWD" /> : null}
            {viewResident.tags.voter ? <TagBadge label="Voter" /> : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <HistoryCard title="Document History" items={viewResident.documentHistory} />
            <HistoryCard title="Request History" items={viewResident.requestHistory} />
          </div>
        </ModalLayout>
      ) : null}
    </section>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: "emerald" | "amber" | "blue" | "violet" | "cyan";
}) {
  const colorStyles: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    blue: "text-indigo-600 bg-indigo-50 border-indigo-100",
    violet: "text-violet-600 bg-violet-50 border-violet-100",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
  };

  const style = colorStyles[color];

  return (
    <article className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)]/40 hover:shadow-lg">
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105",
          style
        )}
      >
        <Icon className="h-7 w-7" />
      </div>

      <div className="flex flex-col justify-center gap-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </p>

        <p className="font-display text-2xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--primary)]">
          {value}
        </p>

        <p className="text-[11px] font-medium leading-tight text-[var(--muted)] line-clamp-1">
          {description}
        </p>
      </div>

      {/* Subtle background glow effect */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-16 w-16 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]",
          color === "emerald"
            ? "bg-emerald-500"
            : color === "amber"
              ? "bg-amber-500"
              : color === "blue"
                ? "bg-indigo-500"
                : color === "violet"
                  ? "bg-violet-500"
                  : "bg-cyan-500",
          "rounded-full blur-2xl"
        )}
      />
    </article>
  );
}

function StatusBadge({ status }: { status: ResidentStatus }) {
  const className =
    status === "Active"
      ? "bg-emerald-500/15 text-emerald-600"
      : status === "Inactive"
        ? "bg-amber-500/15 text-amber-600"
        : "bg-rose-500/15 text-rose-600";

  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{status}</span>;
}

function SelectFilter({
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
    <label className="text-xs font-medium text-[var(--muted)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-[var(--text)] shadow-sm"
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

function SortControl({
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
}: {
  sortBy: SortBy;
  sortDirection: SortDirection;
  setSortBy: (value: SortBy) => void;
  setSortDirection: (value: SortDirection) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1.5 text-xs shadow-sm">
      <Users className="h-3.5 w-3.5 text-[var(--muted)]" />
      <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)} className="bg-transparent text-[var(--text)]">
        <option value="name">Sort: Name</option>
        <option value="age">Sort: Age</option>
        <option value="dateRegistered">Sort: Date Registered</option>
      </select>
      <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value as SortDirection)} className="bg-transparent text-[var(--text)]">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  );
}

function TagToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-xs font-medium text-[var(--text)] shadow-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[var(--card-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text)]">
      {label}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 text-center">
      <p className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

function ModalLayout({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--text)]">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] p-1.5 text-[var(--muted)] transition hover:bg-[var(--card-soft)] hover:text-[var(--text)]" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  error,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}

function HistoryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
        {items.length === 0 ? <li className="text-[var(--muted)]">No records.</li> : null}
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-[var(--card)] px-2 py-1.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
