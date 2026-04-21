import type { AgeGroup, Resident, ResidentFilters, ResidentFormInput } from "./types";

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function getFullName(resident: Pick<Resident, "firstName" | "middleName" | "lastName">) {
  return [resident.firstName, resident.middleName, resident.lastName].filter(Boolean).join(" ");
}

export function computeAge(birthdate: string) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return Math.max(0, age);
}

export function getAgeGroup(age: number): AgeGroup {
  if (age >= 60) {
    return "Senior";
  }

  if (age >= 18) {
    return "Adult";
  }

  return "Child";
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function isWithinDateRange(value: string, from: string, to: string) {
  const target = new Date(value).getTime();
  const fromTime = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
  const toTime = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
  return target >= fromTime && target <= toTime;
}

export function matchesResidentSearch(resident: Resident, search: string) {
  const q = normalizeText(search);
  if (!q) {
    return true;
  }

  const fields = [
    resident.id,
    resident.address,
    resident.firstName,
    resident.lastName,
    getFullName(resident),
  ].map(normalizeText);

  return fields.some((field) => field.includes(q));
}

export function matchesResidentFilters(resident: Resident, filters: ResidentFilters) {
  const age = computeAge(resident.birthdate);

  if (filters.status !== "All" && resident.status !== filters.status) {
    return false;
  }

  if (filters.gender !== "All" && resident.gender !== filters.gender) {
    return false;
  }

  if (filters.civilStatus !== "All" && resident.civilStatus !== filters.civilStatus) {
    return false;
  }

  if (filters.ageGroup !== "All" && getAgeGroup(age) !== filters.ageGroup) {
    return false;
  }

  if (filters.seniorOnly && !resident.tags.senior) {
    return false;
  }

  if (filters.pwdOnly && !resident.tags.pwd) {
    return false;
  }

  if (filters.voterOnly && !resident.tags.voter) {
    return false;
  }

  return isWithinDateRange(resident.dateRegistered, filters.registeredFrom, filters.registeredTo);
}

export function generateResidentId(existing: Resident[]) {
  const now = new Date();
  const year = now.getFullYear();
  const numericParts = existing
    .map((r) => Number.parseInt(r.id.split("-").at(-1) ?? "0", 10))
    .filter(Number.isFinite);
  const next = (Math.max(0, ...numericParts) + 1).toString().padStart(4, "0");
  return `RES-${year}-${next}`;
}

export function getTimestamp() {
  return new Date().toISOString();
}

export function toCsvRows(residents: Resident[]) {
  const headers = [
    "Resident ID",
    "Full Name",
    "Birthdate",
    "Age",
    "Gender",
    "Civil Status",
    "Address",
    "Status",
    "Senior",
    "PWD",
    "Voter",
    "Date Registered",
    "Last Updated",
  ];

  const rows = residents.map((resident) => {
    const age = computeAge(resident.birthdate);
    return [
      resident.id,
      getFullName(resident),
      resident.birthdate,
      String(age),
      resident.gender,
      resident.civilStatus,
      resident.address,
      resident.status,
      resident.tags.senior ? "Yes" : "No",
      resident.tags.pwd ? "Yes" : "No",
      resident.tags.voter ? "Yes" : "No",
      resident.dateRegistered,
      resident.lastUpdated,
    ];
  });

  return [headers, ...rows];
}

function escapeCsvCell(value: string) {
  const normalized = value.replace(/"/g, '""');
  return `"${normalized}"`;
}

export function downloadCsv(filename: string, rows: string[][]) {
  const content = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadBlob(filename, content, "text/csv;charset=utf-8;");
}

export function downloadExcelCompatible(filename: string, rows: string[][]) {
  const content = rows.map((row) => row.join("\t")).join("\n");
  downloadBlob(filename, content, "application/vnd.ms-excel;charset=utf-8;");
}

function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function validateResidentInput(input: ResidentFormInput) {
  const errors: Partial<Record<keyof ResidentFormInput, string>> = {};

  if (!input.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!input.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!input.birthdate) {
    errors.birthdate = "Birthdate is required.";
  }

  if (!input.gender) {
    errors.gender = "Gender is required.";
  }

  if (!input.address.trim()) {
    errors.address = "Address is required.";
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "Email format is invalid.";
  }

  if (input.contactNumber && !/^[0-9+\-()\s]{7,20}$/.test(input.contactNumber)) {
    errors.contactNumber = "Contact number format is invalid.";
  }

  return errors;
}
