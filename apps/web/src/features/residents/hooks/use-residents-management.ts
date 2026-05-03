"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type {
  Resident,
  ResidentFilters,
  ResidentFormInput,
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
import { 
  EMPTY_FILTERS, 
  EMPTY_FORM, 
  PENDING_RESIDENTS_KEY, 
  SEED_RESIDENTS 
} from "../constants";

export type ModalMode = "create" | "edit";

export function useResidentsManagement() {
  const [role] = useState<UserRole>("Admin");
  const [residents, setResidents] = useState<Resident[]>([]);
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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [viewResident, setViewResident] = useState<Resident | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ModalMode>("create");
  const [formInput, setFormInput] = useState<ResidentFormInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ResidentFormInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Initial load
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
              
              const computedAddress = input.address.trim() || [
                input.houseNo && `House ${input.houseNo.trim()}`,
                input.blockLot && `Block/Lot ${input.blockLot.trim()}`,
                input.street.trim(),
                input.barangay.trim(),
                input.cityMunicipality.trim(),
                input.province.trim(),
              ].filter(Boolean).join(", ");

              const computedHouseholdInfo = input.householdInfo.trim() || [
                input.headOfHousehold === "Yes" ? "Head of Household" : "Household Member",
                input.residenceType
              ].filter(Boolean).join(" | ");

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
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Search debounce
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
      if (sortBy === "id") {
        return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }

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

  const removeFilter = useCallback((id: keyof ResidentFilters) => {
    setFilters((prev) => ({
      ...prev,
      [id]: EMPTY_FILTERS[id],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setCurrentPage(1);
  }, []);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const allVisibleSelected = useMemo(() => 
    paginatedResidents.length > 0 && paginatedResidents.every((resident) => selectedIds.has(resident.id)),
    [paginatedResidents, selectedIds]
  );

  const toggleSelectVisibleRows = useCallback(() => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        paginatedResidents.forEach((resident) => next.delete(resident.id));
      } else {
        paginatedResidents.forEach((resident) => next.add(resident.id));
      }
      return next;
    });
  }, [allVisibleSelected, paginatedResidents]);

  const softDeleteByIds = useCallback((ids: string[]) => {
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
  }, []);

  const exportResidents = useCallback((scope: "all" | "filtered" | "selected", format: "csv" | "excel") => {
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
  }, [activeResidents, processedResidents, selectedIds]);

  const openCreateModal = useCallback(() => {
    setFormMode("create");
    setEditingResident(null);
    setFormInput(EMPTY_FORM);
    setFormErrors({});
    setServerError(null);
    setIsFormOpen(true);
  }, []);

  const openEditModal = useCallback((resident: Resident) => {
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
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setServerError(null);
    setFormErrors({});
  }, []);

  const saveResident = useCallback(() => {
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
    
    const computedAddress = formInput.address.trim() || [
      formInput.houseNo && `House ${formInput.houseNo.trim()}`,
      formInput.blockLot && `Block/Lot ${formInput.blockLot.trim()}`,
      formInput.street.trim(),
      formInput.barangay.trim(),
      formInput.cityMunicipality.trim(),
      formInput.province.trim(),
    ].filter(Boolean).join(", ");

    const computedHouseholdInfo = formInput.householdInfo.trim() || [
      formInput.headOfHousehold === "Yes" ? "Head of Household" : "Household Member",
      formInput.residenceType
    ].filter(Boolean).join(" | ");

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
  }, [formInput, formMode, residents, editingResident, closeFormModal]);

  return {
    role,
    residents,
    processedResidents,
    paginatedResidents,
    metrics,
    searchInput,
    setSearchInput,
    filters,
    setFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    safeCurrentPage,
    selectedIds,
    selectedCount: selectedIds.size,
    allVisibleSelected,
    viewMode,
    setViewMode,
    viewResident,
    setViewResident,
    editingResident,
    isFormOpen,
    formMode,
    formInput,
    setFormInput,
    formErrors,
    serverError,
    activeFilterItems,
    fetchError,
    setFetchError,
    
    // Handlers
    removeFilter,
    resetFilters,
    toggleSelectRow,
    toggleSelectVisibleRows,
    softDeleteByIds,
    exportResidents,
    openCreateModal,
    openEditModal,
    closeFormModal,
    saveResident,
  };
}
