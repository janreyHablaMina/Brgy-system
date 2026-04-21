"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Archive,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
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
const GENDER_OPTIONS: Array<"All" | ResidentGender> = ["All", "Male", "Female", "LGBTQIA+", "Other"];
const CIVIL_STATUS_OPTIONS: Array<"All" | CivilStatus> = ["All", "Single", "Married", "Widowed", "Separated"];
const AGE_GROUP_OPTIONS = ["All", "Child", "Adult", "Senior"] as const;
const PENDING_RESIDENTS_KEY = "brgy-pending-residents";
const SECTOR_OPTIONS = [
  "Senior Citizen",
  "Persons with Disability",
  "Solo Parent",
  "Displaced Worker",
  "Indigenous People",
  "Indigent Person",
  "Informal Settlers",
  "4Ps Beneficiary",
  "Farmer",
  "Nano/Micro Entrepreneur",
  "Student",
  "OFW",
  "TODA Driver",
  "JODA Driver",
  "Other Drivers",
  "Vendor",
  "With Comorbidities",
  "Working Student",
  "LGBTQIA+",
] as const;

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
  profilePhotoName: "",
  birthdate: "",
  placeOfBirth: "",
  gender: "Male",
  headOfHousehold: "No",
  residenceType: "Village",
  address: "",
  province: "",
  cityMunicipality: "",
  barangay: "",
  street: "",
  blockLot: "",
  houseNo: "",
  typeOfResident: "",
  contactNumber: "",
  email: "",
  civilStatus: "Single",
  employmentStatus: "",
  citizenship: "",
  religion: "",
  precinctNo: "",
  bloodType: "",
  sectors: [],
  organDonor: "No",
  healthHistory: "",
  educationalAttainments: [
    {
      level: "",
      course: "",
      school: "",
      startYear: "",
      endYear: "",
      currentlyStudying: false,
    },
  ],
  workExperiences: [
    {
      position: "",
      companyName: "",
      employmentType: "",
      startYear: "",
      endYear: "",
      jobDescription: "",
    },
  ],
  gsisSssNo: "",
  gsisSssExpiration: "",
  philHealthNo: "",
  philHealthExpiration: "",
  pagIbigNo: "",
  pagIbigExpiration: "",
  tinNo: "",
  tinExpiration: "",
  pwdId: "",
  pwdIdExpiration: "",
  seniorCitizenId: "",
  votersNo: "",
  barangayPosition: "",
  barangayRoleStartDate: "",
  barangayRoleEndDate: "",
  emergencyFullName: "",
  emergencyContactNo: "",
  emergencyAddress: "",
  thumbmarkFileName: "",
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
      let nextResidents = [...SEED_RESIDENTS];

      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(PENDING_RESIDENTS_KEY);
        if (raw) {
          try {
            const pending = JSON.parse(raw) as ResidentFormInput[];
            pending.forEach((input) => {
              const now = getTimestamp();
              const age = computeAge(input.birthdate);
              const seniorFromTags = age >= 60 || input.tags.senior || input.sectors.includes("Senior Citizen");
              const pwdFromTags = input.tags.pwd || input.sectors.includes("Persons with Disability");
              const voterFromTags = input.tags.voter || Boolean(input.precinctNo || input.votersNo);
              const computedAddress =
                input.address.trim() ||
                [
                  input.houseNo && `House ${input.houseNo.trim()}`,
                  input.blockLot && `Block/Lot ${input.blockLot.trim()}`,
                  input.street.trim(),
                  input.barangay.trim(),
                  input.cityMunicipality.trim(),
                  input.province.trim(),
                ]
                  .filter(Boolean)
                  .join(", ");
              const computedHouseholdInfo =
                input.householdInfo.trim() ||
                [input.headOfHousehold === "Yes" ? "Head of Household" : "Household Member", input.residenceType]
                  .filter(Boolean)
                  .join(" | ");

              nextResidents = [
                {
                  id: generateResidentId(nextResidents),
                  firstName: input.firstName.trim(),
                  middleName: input.middleName.trim() || undefined,
                  lastName: input.lastName.trim(),
                  birthdate: input.birthdate,
                  gender: input.gender,
                  civilStatus: input.civilStatus,
                  address: computedAddress,
                  contactNumber: input.contactNumber.trim() || undefined,
                  email: input.email.trim() || undefined,
                  status: "Active",
                  tags: { senior: seniorFromTags, pwd: pwdFromTags, voter: voterFromTags },
                  dateRegistered: now,
                  lastUpdated: now,
                  householdInfo: computedHouseholdInfo || undefined,
                  profileData: {
                    ...input,
                    address: computedAddress,
                    householdInfo: computedHouseholdInfo,
                    tags: { senior: seniorFromTags, pwd: pwdFromTags, voter: voterFromTags },
                  },
                  documentHistory: ["Profile created via onboarding form"],
                  requestHistory: [],
                },
                ...nextResidents,
              ];
            });
            localStorage.removeItem(PENDING_RESIDENTS_KEY);
          } catch {
            localStorage.removeItem(PENDING_RESIDENTS_KEY);
          }
        }
      }

      setResidents(nextResidents);
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
  const activeFilterItems = useMemo(() => {
    const items: { id: keyof ResidentFilters; label: string }[] = [];
    if (filters.status !== "All") items.push({ id: "status", label: `Status: ${filters.status}` });
    if (filters.gender !== "All") items.push({ id: "gender", label: `Gender: ${filters.gender}` });
    if (filters.civilStatus !== "All") items.push({ id: "civilStatus", label: `Status: ${filters.civilStatus}` });
    if (filters.ageGroup !== "All") items.push({ id: "ageGroup", label: `Age: ${filters.ageGroup}` });
    if (filters.seniorOnly) items.push({ id: "seniorOnly", label: "Senior" });
    if (filters.pwdOnly) items.push({ id: "pwdOnly", label: "PWD" });
    if (filters.voterOnly) items.push({ id: "voterOnly", label: "Voter" });
    if (filters.registeredFrom) items.push({ id: "registeredFrom", label: `From ${formatDate(filters.registeredFrom)}` });
    if (filters.registeredTo) items.push({ id: "registeredTo", label: `To ${formatDate(filters.registeredTo)}` });
    return items;
  }, [filters]);

  function removeFilter(id: keyof ResidentFilters) {
    setFilters((prev) => ({
      ...prev,
      [id]: EMPTY_FILTERS[id],
    }));
  }

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

  function openEditModal(resident: Resident) {
    setFormMode("edit");
    setEditingResident(resident);
    setFormInput({
      ...EMPTY_FORM,
      ...(resident.profileData ?? {}),
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

  function toggleSector(sector: string) {
    setFormInput((previous) => {
      const sectors = previous.sectors.includes(sector)
        ? previous.sectors.filter((item) => item !== sector)
        : [...previous.sectors, sector];
      return { ...previous, sectors };
    });
  }

  function addEducationalAttainment() {
    setFormInput((previous) => ({
      ...previous,
      educationalAttainments: [
        ...previous.educationalAttainments,
        {
          level: "",
          course: "",
          school: "",
          startYear: "",
          endYear: "",
          currentlyStudying: false,
        },
      ],
    }));
  }

  function updateEducationalAttainment(
    index: number,
    key: keyof ResidentFormInput["educationalAttainments"][number],
    value: string | boolean
  ) {
    setFormInput((previous) => ({
      ...previous,
      educationalAttainments: previous.educationalAttainments.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addWorkExperience() {
    setFormInput((previous) => ({
      ...previous,
      workExperiences: [
        ...previous.workExperiences,
        {
          position: "",
          companyName: "",
          employmentType: "",
          startYear: "",
          endYear: "",
          jobDescription: "",
        },
      ],
    }));
  }

  function updateWorkExperience(
    index: number,
    key: keyof ResidentFormInput["workExperiences"][number],
    value: string
  ) {
    setFormInput((previous) => ({
      ...previous,
      workExperiences: previous.workExperiences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
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
    const computedAddress =
      formInput.address.trim() ||
      [
        formInput.houseNo && `House ${formInput.houseNo.trim()}`,
        formInput.blockLot && `Block/Lot ${formInput.blockLot.trim()}`,
        formInput.street.trim(),
        formInput.barangay.trim(),
        formInput.cityMunicipality.trim(),
        formInput.province.trim(),
      ]
        .filter(Boolean)
        .join(", ");

    const computedHouseholdInfo =
      formInput.householdInfo.trim() ||
      [formInput.headOfHousehold === "Yes" ? "Head of Household" : "Household Member", formInput.residenceType]
        .filter(Boolean)
        .join(" | ");

    const payloadBase = {
      firstName: formInput.firstName.trim(),
      middleName: formInput.middleName.trim() || undefined,
      lastName: formInput.lastName.trim(),
      birthdate: formInput.birthdate,
      gender: formInput.gender,
      civilStatus: formInput.civilStatus,
      address: computedAddress,
      contactNumber: formInput.contactNumber.trim() || undefined,
      email: formInput.email.trim() || undefined,
      tags: {
        ...formInput.tags,
        senior: computedSenior,
      },
      householdInfo: computedHouseholdInfo || undefined,
      profileData: {
        ...formInput,
        address: computedAddress,
        householdInfo: computedHouseholdInfo,
      },
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
            <Link
              href="/residents/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Resident
            </Link>
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

      <section className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all",
        !showAdvancedFilters && "pb-4"
      )}>
        {/* Row 1: Search & Primary Selects */}
            <div className="lg:col-span-12 grid gap-5 lg:grid-cols-12 items-start">
              {/* Search Segment */}
              <div className="lg:col-span-5 flex flex-col gap-2 group">
                <span className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Search Registry</span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search name, address, or resident ID..."
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent pl-10 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] placeholder:text-[var(--muted)]/30"
                  />
                </div>
              </div>
              
              {/* Primary Filters Segment */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <SelectFilter
                  label="Status"
                  value={filters.status || "All"}
                  onChange={(value) => setFilters((prev) => ({ ...prev, status: value as ResidentFilters["status"] }))}
                  options={STATUS_OPTIONS}
                />
                <SelectFilter
                  label="Gender"
                  value={filters.gender || "All"}
                  onChange={(value) => setFilters((prev) => ({ ...prev, gender: value as ResidentFilters["gender"] }))}
                  options={GENDER_OPTIONS}
                />
                <SelectFilter
                  label="Civil Status"
                  value={filters.civilStatus || "All"}
                  onChange={(value) => setFilters((prev) => ({ ...prev, civilStatus: value as ResidentFilters["civilStatus"] }))}
                  options={CIVIL_STATUS_OPTIONS}
                />
              </div>
            </div>
  
          {/* Detailed Filters & Actions */}
          {showAdvancedFilters && (
            <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Row 2: Secondary Configuration */}
              <div className="grid gap-6 lg:grid-cols-12 pt-6 border-t border-[var(--border)]/40 items-start">
                <div className="lg:col-span-2">
                  <SelectFilter
                    label="Age Group"
                    value={filters.ageGroup || "All"}
                    onChange={(value) => setFilters((prev) => ({ ...prev, ageGroup: value as ResidentFilters["ageGroup"] }))}
                    options={AGE_GROUP_OPTIONS}
                  />
                </div>
  
                <div className="lg:col-span-4 grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <span className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Date From</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.registeredFrom}
                        onChange={(e) => setFilters(p => ({ ...p, registeredFrom: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] pr-10 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Date To</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.registeredTo}
                        onChange={(e) => setFilters(p => ({ ...p, registeredTo: e.target.value }))}
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] pr-10 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none" />
                    </div>
                  </div>
                </div>
  
                {/* Demographic Segment */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                  <span className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Demographics</span>
                  <div className="flex items-center h-10 gap-5 px-3 bg-[var(--card-soft)]/30 rounded-xl border border-[var(--border)]/40 transition-colors hover:border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.seniorOnly}
                        onChange={(e) => setFilters(p => ({ ...p, seniorOnly: e.target.checked }))}
                        className="h-4 w-4 rounded-md border-[var(--border)] accent-[var(--accent)] transition focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[12px] font-semibold text-[var(--text)]/60 group-hover:text-[var(--text)] transition-colors">Senior</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.pwdOnly}
                        onChange={(e) => setFilters(p => ({ ...p, pwdOnly: e.target.checked }))}
                        className="h-4 w-4 rounded-md border-[var(--border)] accent-[var(--accent)] transition focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[12px] font-semibold text-[var(--text)]/60 group-hover:text-[var(--text)] transition-colors">PWD</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.voterOnly}
                        onChange={(e) => setFilters(p => ({ ...p, voterOnly: e.target.checked }))}
                        className="h-4 w-4 rounded-md border-[var(--border)] accent-[var(--accent)] transition focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[12px] font-semibold text-[var(--text)]/60 group-hover:text-[var(--text)] transition-colors">Voter</span>
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-2.5">
                  <span className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Bulk Status Change</span>
                  <div className="flex items-center h-10 bg-[var(--card-soft)]/30 rounded-xl border border-[var(--border)]/40 px-1 hover:border-[var(--border)] transition-colors">
                    <div className="relative flex-1 group/bulk">
                      <select
                        value={bulkStatus}
                        disabled={selectedCount === 0}
                        onChange={(event) => {
                          const newStatus = event.target.value as ResidentStatus;
                          setBulkStatus(newStatus);
                          // Trigger update logic
                          softDeleteByIds(Array.from(selectedIds), newStatus);
                        }}
                        className="h-8 w-full bg-transparent px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] outline-none appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group-hover/bulk:text-[var(--primary)] transition-colors"
                      >
                        <option value="" disabled>Select Status...</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Deceased">Deceased</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none group-hover/bulk:text-[var(--primary)] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/10 mt-4">
                <span className="text-[10px] text-[var(--muted)]/50 italic px-1">Configure your view using the parameters above.</span>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(false)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-all hover:bg-[var(--card-soft)]"
                >
                  Hide Parameters
                  <ChevronDown className="h-3 w-3 rotate-180 opacity-60" />
                </button>
              </div>
            </div>
          )}
  
          {!showAdvancedFilters && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border)]/40">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-soft)]/50 border border-[var(--border)]/40">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]/80">Active Configuration:</span>
                  {activeFilterItems.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {activeFilterItems.map(item => (
                        <FilterChip key={item.id} label={item.label} onRemove={() => removeFilter(item.id)} />
                      ))}
                      <button 
                        onClick={resetFilters}
                        className="ml-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        Reset All
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-[var(--muted)]/40">Default View</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(true)}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[var(--primary)]/10 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"
              >
                Advanced Configuration
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>
  
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            <Users className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Total Records</span>
            <span className="text-[var(--primary)] ml-1 font-extrabold">
              {processedResidents.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Premium Export Command */}
            <DropdownMenu
              className="flex h-9 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--card-soft)]"
              trigger={
                <>
                  <Download className="h-4 w-4 text-[var(--primary)]" />
                  Export Registry
                  <ChevronDown className="h-3.5 w-3.5 opacity-40 ml-1" />
                </>
              }
              items={[
                { 
                  label: "Download as CSV", 
                  onClick: () => exportResidents("all", "csv"), 
                  icon: FileText,
                  className: "text-blue-600" 
                },
                { 
                  label: "Download as Excel", 
                  onClick: () => exportResidents("filtered", "excel"), 
                  icon: FileSpreadsheet,
                  className: "text-emerald-600"
                },
              ]}
            />
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
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectVisibleRows}
                        className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                        aria-label="Select all visible residents"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Barangay ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Full Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Address</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Age</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Gender</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Civil Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40">
                  {paginatedResidents.map((resident) => {
                    const age = computeAge(resident.birthdate);
                    return (
                      <tr key={resident.id} className="group text-[var(--text)]">
                        <td className="relative px-4 py-3.5">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                          />
                          <input
                            type="checkbox"
                            checked={selectedIds.has(resident.id)}
                            onChange={() => toggleSelectRow(resident.id)}
                            className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                            aria-label={`Select ${getFullName(resident)}`}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[11px] text-[var(--muted)] uppercase">{resident.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src="/avatar.png"
                              name={getFullName(resident)}
                              className="h-9 w-9"
                              hideText
                            />
                            <div className="flex flex-col">
                              <span className="tracking-tight text-[var(--text)]">
                                {getFullName(resident)}
                              </span>
                              <span className="text-[10px] font-medium text-[var(--muted)]">
                                resident-profile.v1
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 max-w-[240px] truncate font-medium text-[var(--text)]/80" title={resident.address}>
                          {resident.address}
                        </td>
                        <td className="px-4 py-3.5 text-[var(--text)]">{age}</td>
                        <td className="px-4 py-3.5 text-[var(--muted)] font-medium">{resident.gender}</td>
                        <td className="px-4 py-3.5 text-[var(--muted)] font-medium">{resident.civilStatus}</td>
                        <td className="px-4 py-3.5">
                          <DropdownMenu
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                            trigger={
                              <>
                                <MoreHorizontal className="h-4 w-4" />
                              </>
                            }
                            items={[
                              { label: "View Profile", onClick: () => setViewResident(resident), icon: Eye },
                              { label: "Edit Record", onClick: () => openEditModal(resident), icon: Pencil },
                              { label: "Divider", component: <div className="my-1 h-px bg-[var(--border)]/50" /> },
                              { 
                                label: "Delete Resident", 
                                onClick: () => softDeleteByIds([resident.id]), 
                                icon: Trash2,
                                disabled: role !== "Admin"
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Page <span className="text-[var(--text)]">{safeCurrentPage}</span> of {totalPages}
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
                  disabled={safeCurrentPage === 1}
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
                          safeCurrentPage === pageNum
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-[var(--muted)]">...</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, Math.min(value, totalPages) + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-30"
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
          <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/70 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Resident Profile Form</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Fields marked with <span className="font-semibold text-rose-500">*</span> are required.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Profile</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-xs font-medium text-[var(--muted)]">Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(event) => setFormValue("profilePhotoName", event.target.files?.[0]?.name ?? "")}
                  className="mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--primary)]"
                />
              </label>
              <InputField label="First Name *" value={formInput.firstName} onChange={(value) => setFormValue("firstName", value)} error={formErrors.firstName} />
              <InputField label="Middle Name" value={formInput.middleName} onChange={(value) => setFormValue("middleName", value)} />
              <InputField label="Last Name *" value={formInput.lastName} onChange={(value) => setFormValue("lastName", value)} error={formErrors.lastName} />
              <SelectField label="Gender *" value={formInput.gender} onChange={(value) => setFormValue("gender", value as ResidentGender)} options={["Male", "Female", "LGBTQIA+", "Other"]} error={formErrors.gender} />
              <InputField label="Date of Birth *" type="date" value={formInput.birthdate} onChange={(value) => setFormValue("birthdate", value)} error={formErrors.birthdate} />
              <InputField label="Place of Birth" value={formInput.placeOfBirth} onChange={(value) => setFormValue("placeOfBirth", value)} />
              <InputField label="Contact No" value={formInput.contactNumber} onChange={(value) => setFormValue("contactNumber", value)} error={formErrors.contactNumber} />
              <SelectField label="Civil Status" value={formInput.civilStatus} onChange={(value) => setFormValue("civilStatus", value as CivilStatus)} options={["Single", "Married", "Widowed", "Separated"]} />
              <SelectField label="Head of Household" value={formInput.headOfHousehold} onChange={(value) => setFormValue("headOfHousehold", value as "Yes" | "No")} options={["No", "Yes"]} />
              <SelectField label="Residence Type" value={formInput.residenceType} onChange={(value) => setFormValue("residenceType", value as "Village" | "Condominium" | "Other")} options={["Village", "Condominium", "Other"]} />
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Current Address</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputField label="Province" value={formInput.province} onChange={(value) => setFormValue("province", value)} />
              <InputField label="City / Municipality" value={formInput.cityMunicipality} onChange={(value) => setFormValue("cityMunicipality", value)} />
              <InputField label="Barangay" value={formInput.barangay} onChange={(value) => setFormValue("barangay", value)} />
              <InputField label="Street" value={formInput.street} onChange={(value) => setFormValue("street", value)} />
              <InputField label="Block / Lot" value={formInput.blockLot} onChange={(value) => setFormValue("blockLot", value)} />
              <InputField label="House No" value={formInput.houseNo} onChange={(value) => setFormValue("houseNo", value)} />
              <InputField label="Type of Resident" value={formInput.typeOfResident} onChange={(value) => setFormValue("typeOfResident", value)} />
              <InputField label="Address (Full)" value={formInput.address} onChange={(value) => setFormValue("address", value)} error={formErrors.address} />
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Other Information</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputField label="Email" value={formInput.email} onChange={(value) => setFormValue("email", value)} error={formErrors.email} />
              <InputField label="Current Employment Status" value={formInput.employmentStatus} onChange={(value) => setFormValue("employmentStatus", value)} />
              <InputField label="Citizenship" value={formInput.citizenship} onChange={(value) => setFormValue("citizenship", value)} />
              <InputField label="Religion" value={formInput.religion} onChange={(value) => setFormValue("religion", value)} />
              <InputField label="Precinct No" value={formInput.precinctNo} onChange={(value) => setFormValue("precinctNo", value)} />
              <InputField label="Blood Type" value={formInput.bloodType} onChange={(value) => setFormValue("bloodType", value)} />
              <SelectField label="Organ Donor" value={formInput.organDonor} onChange={(value) => setFormValue("organDonor", value as "Yes" | "No")} options={["No", "Yes"]} />
              <InputField label="Household Info" value={formInput.householdInfo} onChange={(value) => setFormValue("householdInfo", value)} />
              <label className="md:col-span-2">
                <span className="text-xs font-medium text-[var(--muted)]">Health History</span>
                <textarea
                  value={formInput.healthHistory}
                  onChange={(event) => setFormValue("healthHistory", event.target.value)}
                  className="mt-1 min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </label>
            </div>
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Sector / Organization</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SECTOR_OPTIONS.map((sector) => (
                  <label key={sector} className="flex items-center gap-2 text-xs text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={formInput.sectors.includes(sector)}
                      onChange={() => toggleSector(sector)}
                      className="rounded border-[var(--border)] accent-[var(--accent)]"
                    />
                    {sector}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Quick Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <TagToggle
                  label="Senior (auto if age 60+)"
                  checked={formInput.tags.senior || (formInput.birthdate ? computeAge(formInput.birthdate) >= 60 : false)}
                  onChange={(checked) => setFormValue("tags", { ...formInput.tags, senior: checked })}
                />
                <TagToggle label="PWD" checked={formInput.tags.pwd} onChange={(checked) => setFormValue("tags", { ...formInput.tags, pwd: checked })} />
                <TagToggle label="Voter" checked={formInput.tags.voter} onChange={(checked) => setFormValue("tags", { ...formInput.tags, voter: checked })} />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Educational Attainment</p>
            <div className="mt-3 space-y-3">
              {formInput.educationalAttainments.map((education, index) => (
                <div key={`education-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Entry {index + 1}</p>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <InputField label="Level" value={education.level} onChange={(value) => updateEducationalAttainment(index, "level", value)} />
                    <InputField label="Course" value={education.course} onChange={(value) => updateEducationalAttainment(index, "course", value)} />
                    <InputField label="School" value={education.school} onChange={(value) => updateEducationalAttainment(index, "school", value)} />
                    <InputField label="Start Year" value={education.startYear} onChange={(value) => updateEducationalAttainment(index, "startYear", value)} />
                    <InputField label="End Year" value={education.endYear} onChange={(value) => updateEducationalAttainment(index, "endYear", value)} />
                    <label className="mt-6 flex items-center gap-2 text-xs font-medium text-[var(--text)]">
                      <input type="checkbox" checked={education.currentlyStudying} onChange={(event) => updateEducationalAttainment(index, "currentlyStudying", event.target.checked)} className="rounded border-[var(--border)] accent-[var(--accent)]" />
                      Currently studying
                    </label>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addEducationalAttainment} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--card-soft)]">
                Add Another Educational Attainment
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Work Experience</p>
            <div className="mt-3 space-y-3">
              {formInput.workExperiences.map((work, index) => (
                <div key={`work-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Entry {index + 1}</p>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <InputField label="Position" value={work.position} onChange={(value) => updateWorkExperience(index, "position", value)} />
                    <InputField label="Company / Business Name" value={work.companyName} onChange={(value) => updateWorkExperience(index, "companyName", value)} />
                    <InputField label="Type of Employment" value={work.employmentType} onChange={(value) => updateWorkExperience(index, "employmentType", value)} />
                    <InputField label="Start Year" value={work.startYear} onChange={(value) => updateWorkExperience(index, "startYear", value)} />
                    <InputField label="End Year" value={work.endYear} onChange={(value) => updateWorkExperience(index, "endYear", value)} />
                    <label className="md:col-span-2">
                      <span className="text-xs font-medium text-[var(--muted)]">Job Description</span>
                      <textarea
                        value={work.jobDescription}
                        onChange={(event) => updateWorkExperience(index, "jobDescription", event.target.value)}
                        className="mt-1 min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addWorkExperience} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--card-soft)]">
                Add Another Work Experience
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Government Related Info</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputField label="GSIS / SSS No." value={formInput.gsisSssNo} onChange={(value) => setFormValue("gsisSssNo", value)} />
              <InputField label="GSIS / SSS Expiration Date" type="date" value={formInput.gsisSssExpiration} onChange={(value) => setFormValue("gsisSssExpiration", value)} />
              <InputField label="PhilHealth No." value={formInput.philHealthNo} onChange={(value) => setFormValue("philHealthNo", value)} />
              <InputField label="PhilHealth Expiration Date" type="date" value={formInput.philHealthExpiration} onChange={(value) => setFormValue("philHealthExpiration", value)} />
              <InputField label="Pag-IBIG No." value={formInput.pagIbigNo} onChange={(value) => setFormValue("pagIbigNo", value)} />
              <InputField label="Pag-IBIG Expiration Date" type="date" value={formInput.pagIbigExpiration} onChange={(value) => setFormValue("pagIbigExpiration", value)} />
              <InputField label="TIN No." value={formInput.tinNo} onChange={(value) => setFormValue("tinNo", value)} />
              <InputField label="TIN Expiration Date" type="date" value={formInput.tinExpiration} onChange={(value) => setFormValue("tinExpiration", value)} />
              <InputField label="PWD ID" value={formInput.pwdId} onChange={(value) => setFormValue("pwdId", value)} />
              <InputField label="PWD ID Expiration Date" type="date" value={formInput.pwdIdExpiration} onChange={(value) => setFormValue("pwdIdExpiration", value)} />
              <InputField label="Senior Citizen ID" value={formInput.seniorCitizenId} onChange={(value) => setFormValue("seniorCitizenId", value)} />
              <InputField label="Voter's No." value={formInput.votersNo} onChange={(value) => setFormValue("votersNo", value)} />
              <InputField label="Barangay Position" value={formInput.barangayPosition} onChange={(value) => setFormValue("barangayPosition", value)} />
              <InputField label="Barangay Role Start Date" type="date" value={formInput.barangayRoleStartDate} onChange={(value) => setFormValue("barangayRoleStartDate", value)} />
              <InputField label="Barangay Role End Date" type="date" value={formInput.barangayRoleEndDate} onChange={(value) => setFormValue("barangayRoleEndDate", value)} />
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">In Case of Emergency</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputField label="Full Name" value={formInput.emergencyFullName} onChange={(value) => setFormValue("emergencyFullName", value)} />
              <InputField label="Contact No." value={formInput.emergencyContactNo} onChange={(value) => setFormValue("emergencyContactNo", value)} error={formErrors.emergencyContactNo} />
              <InputField label="Address" value={formInput.emergencyAddress} onChange={(value) => setFormValue("emergencyAddress", value)} className="md:col-span-2" />
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Thumbmark Capture</p>
            <div className="mt-3">
              <label>
                <span className="text-xs font-medium text-[var(--muted)]">Upload thumbmark image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFormValue("thumbmarkFileName", event.target.files?.[0]?.name ?? "")}
                  className="mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--primary)]"
                />
              </label>
            </div>
          </div>

          {serverError ? <p className="mt-3 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-500">{serverError}</p> : null}

          <div className="mt-4 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={closeFormModal}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveResident}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            >
              {formMode === "create" ? "Save Resident" : "Update Resident"}
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
    <article className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)]/40">
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
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
  const styles =
    status === "Active"
      ? "bg-emerald-500/10 text-emerald-600 shadow-[0_2px_12px_rgba(16,185,129,0.12)] border-emerald-500/20"
      : status === "Inactive"
        ? "bg-amber-500/10 text-amber-600 shadow-[0_2px_12px_rgba(245,158,11,0.12)] border-amber-500/20"
        : "bg-rose-500/10 text-rose-600 shadow-[0_2px_12px_rgba(239,68,68,0.12)] border-rose-500/20";

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all",
      styles
    )}>
      {status}
    </span>
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
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">
        {label}
      </span>
      <div className="relative group/select">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-3 pr-10 text-sm text-[var(--text)] outline-none appearance-none transition focus:border-[var(--primary)]/40"
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

function TagToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
        checked
          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
      )}
    >
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full transition-colors",
          checked ? "bg-white" : "bg-[var(--muted)]"
        )}
      />
      {label}
    </button>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-[var(--card-soft)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--muted)] border border-[var(--border)] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {label}
    </span>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/[0.03] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/[0.07]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-[var(--primary)]/10"
      >
        <X className="h-3 w-3" />
      </button>
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
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
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
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
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}

function HistoryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-4">
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
