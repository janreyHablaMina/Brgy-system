export type PropertyClassification = "Lot Only" | "Building Only";

export type Property = {
  id: string; // PROP-2026-0001
  ownerId?: string; // Linked resident ID
  ownerName: string; // Display name or fallback
  ownerAvatar?: string;
  classification: PropertyClassification;
  address: string;
  purokZone: string;
  dateRegistered: string;
  lastUpdated: string;
  deletedAt?: string | null;
};

export type PropertyFormInput = {
  ownerId?: string;
  ownerName: string;
  ownerAvatar?: string;
  classification: PropertyClassification;
  address: string;
  purokZone: string;
};

export type PropertyFilters = {
  classification: "All" | PropertyClassification;
  registeredFrom: string;
  registeredTo: string;
};

export type PropertySortBy = "id" | "owner" | "dateRegistered";
export type SortDirection = "asc" | "desc";
