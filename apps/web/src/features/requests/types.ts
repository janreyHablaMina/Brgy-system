import type { DocumentType, DocumentSource } from "../documents/types";

export type RequestStatus = 
  | "New" 
  | "Pending" 
  | "Processing" 
  | "Approved" 
  | "Rejected" 
  | "Converted";

export type RequestPriority = "Low" | "Normal" | "High" | "Urgent";

export type RequestTimelineEvent = {
  id: string;
  status: RequestStatus;
  label: string;
  timestamp: string;
  actor: string;
  remarks?: string;
};

export type Request = {
  id: string;
  type: DocumentType;
  entityName: string;
  entityType: DocumentSource;
  entityId: string;
  purpose: string;
  submittedAt: string;
  status: RequestStatus;
  priority: RequestPriority;
  assignedStaff?: string;
  remarks?: string;
  timeline: RequestTimelineEvent[];
  attachments?: { name: string; url: string }[];
};

export type RequestFilters = {
  search: string;
  status: RequestStatus | "All";
  type: DocumentType | "All";
  source: DocumentSource | "All";
  staff: string | "All";
  dateFrom: string;
  dateTo: string;
};
