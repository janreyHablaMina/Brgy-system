import { Property, PropertyFilters, PropertyFormInput } from "./types";

export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function getTimestamp() {
  return new Date().toISOString();
}

export function generatePropertyId(existing: Property[]) {
  const now = new Date();
  const year = now.getFullYear();
  const numericParts = existing
    .map((p) => {
      const parts = p.id.split("-");
      return Number.parseInt(parts.at(-1) ?? "0", 10);
    })
    .filter(Number.isFinite);
  const next = (Math.max(0, ...numericParts) + 1).toString().padStart(4, "0");
  return `PROP-${year}-${next}`;
}

export function matchesPropertySearch(property: Property, search: string) {
  const q = normalizeText(search);
  if (!q) return true;

  const fields = [
    property.id,
    property.ownerName,
    property.address,
    property.purokZone,
  ].map(normalizeText);

  return fields.some((field) => field.includes(q));
}

export function matchesPropertyFilters(property: Property, filters: PropertyFilters) {
  if (filters.classification !== "All" && property.classification !== filters.classification) {
    return false;
  }

  if (filters.registeredFrom) {
    const target = new Date(property.dateRegistered).getTime();
    const from = new Date(filters.registeredFrom).getTime();
    if (target < from) return false;
  }

  if (filters.registeredTo) {
    const target = new Date(property.dateRegistered).getTime();
    const to = new Date(filters.registeredTo).getTime();
    if (target > to) return false;
  }

  return true;
}

export const SEED_PROPERTIES: Property[] = [
  {
    id: "PROP-2026-0001",
    ownerId: "RES-2026-0001",
    ownerName: "Maria Lopez Santos",
    ownerAvatar: "/avatar.png",
    classification: "Lot Only",
    address: "Purok 1, Brgy. Salaza, Palauig, Zambales",
    purokZone: "Purok 1",
    dateRegistered: "2026-01-15T08:30:00Z",
    lastUpdated: "2026-01-15T08:30:00Z",
  },
  {
    id: "PROP-2026-0002",
    ownerId: "RES-2026-0002",
    ownerName: "Juan Reyes Dela Cruz",
    ownerAvatar: "/avatar.png",
    classification: "Building Only",
    address: "Purok 2, Brgy. Salaza, Palauig, Zambales",
    purokZone: "Purok 2",
    dateRegistered: "2026-02-10T10:45:00Z",
    lastUpdated: "2026-02-10T10:45:00Z",
  },
  {
    id: "PROP-2026-0003",
    ownerId: "RES-2026-0003",
    ownerName: "Ana Garcia Reyes",
    ownerAvatar: "/avatar.png",
    classification: "Lot Only",
    address: "Purok 3, Brgy. Salaza, Palauig, Zambales",
    purokZone: "Purok 3",
    dateRegistered: "2026-03-05T14:20:00Z",
    lastUpdated: "2026-03-05T14:20:00Z",
  },
  {
    id: "PROP-2026-0004",
    ownerId: "RES-2026-0004",
    ownerName: "Pedro Cruz Luna",
    ownerAvatar: "/avatar.png",
    classification: "Building Only",
    address: "Purok 1, Brgy. Salaza, Palauig, Zambales",
    purokZone: "Purok 1",
    dateRegistered: "2026-04-12T09:15:00Z",
    lastUpdated: "2026-04-12T09:15:00Z",
  },
];

export function validatePropertyInput(input: PropertyFormInput) {
  const errors: Partial<Record<keyof PropertyFormInput, string>> = {};

  if (!input.ownerName.trim() && !input.ownerId) {
    errors.ownerName = "Owner is required.";
  }

  if (!input.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!input.purokZone.trim()) {
    errors.purokZone = "Purok/Zone is required.";
  }

  return errors;
}
