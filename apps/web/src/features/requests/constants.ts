import { Request, RequestFilters, RequestStatus } from "./types";
import { MOCK_REQUESTS } from "./mock-data";

export const STATUS_ORDER: RequestStatus[] = [
  "New",
  "Pending",
  "Processing",
  "Approved",
  "Rejected",
  "Converted",
];

export const INITIAL_FILTERS: RequestFilters = {
  search: "",
  status: "All",
  type: "All",
  source: "All",
  staff: "All",
  dateFrom: "",
  dateTo: "",
};

export const DOCUMENT_TYPE_OPTIONS = [
  "All",
  "Barangay Clearance",
  "Certificate of Indigency",
  "Business Endorsement",
  "Certificate of Residency",
  "Certificate of Good Moral",
] as const;

export const SOURCE_OPTIONS = ["All", "Residents", "Establishments"] as const;

export const STAFF_OPTIONS = ["All", "Sgt. Pepper", "Officer Jenny", "Admin"] as const;

export { MOCK_REQUESTS };
