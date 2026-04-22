export type UserRole = "Admin" | "Staff" | "Viewer";
export type DocumentSource = "Residents" | "Establishments" | "Lots / Buildings" | "Case Records / VAWC";

export type DocumentType =
  | "Barangay Clearance"
  | "Certificate of Indigency"
  | "Certificate of Residency"
  | "Business Endorsement"
  | "Certificate of Good Moral";

export type RequestStatus = "Pending" | "Processing" | "Approved" | "Rejected";
export type GeneratedStatus = "Generated" | "Released" | "Archived";

export type EntityRecord = {
  id: string;
  source: DocumentSource;
  displayName: string;
  subtitle: string;
  href: string;
};

export type DocumentRequest = {
  id: string;
  source: DocumentSource;
  entityId: string;
  documentType: DocumentType;
  purpose: string;
  requestedAt: string;
  status: RequestStatus;
  assignedTo?: string;
  remarks?: string;
  generatedDocumentId?: string;
};

export type GeneratedDocument = {
  id: string;
  code: string;
  requestId: string;
  source: DocumentSource;
  entityId: string;
  documentType: DocumentType;
  purpose: string;
  generatedBy: string;
  generatedAt: string;
  validUntil?: string;
  status: GeneratedStatus;
};

export type ActivityLog = {
  id: string;
  actor: string;
  action: string;
  entityType: "request" | "document";
  entityId: string;
  message: string;
  createdAt: string;
};
