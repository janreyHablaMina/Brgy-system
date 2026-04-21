"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  ArrowUpDown,
  BellRing,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileCog,
  FileText,
  Filter,
  Printer,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ActivityLog,
  DocumentRequest,
  DocumentType,
  GeneratedDocument,
  GeneratedStatus,
  RequestStatus,
  ResidentLite,
  UserRole,
} from "../types";
import {
  createActivityId,
  createDocumentCode,
  createRequestId,
  documentMatchesSearch,
  documentStatusTone,
  downloadMockPdf,
  exportCsv,
  formatDate,
  formatDateTime,
  getValidityDate,
  inRange,
  requestMatchesSearch,
  requestStatusTone,
  sortDocuments,
  sortRequests,
} from "../utils";

const DOCUMENT_TYPES: DocumentType[] = [
  "Barangay Clearance",
  "Certificate of Indigency",
  "Certificate of Residency",
  "Business Endorsement",
  "Certificate of Good Moral",
];

const STAFF_MEMBERS = ["Pauline Seitz", "Rico Santos", "Aira Flores", "Miguel Ramos"];
const REQUEST_STATUS_OPTIONS: Array<"All" | RequestStatus> = ["All", "Pending", "Processing", "Approved", "Rejected"];
const GENERATED_STATUS_OPTIONS: Array<"All" | GeneratedStatus> = ["All", "Generated", "Released", "Archived"];
const TAB_OPTIONS = ["Requests", "Generated Documents", "Analytics"] as const;

const ROLE_PERMISSIONS: Record<
  UserRole,
  {
    processRequests: boolean;
    approveReject: boolean;
    generateDocuments: boolean;
    archiveDocuments: boolean;
    bulkActions: boolean;
  }
> = {
  Admin: {
    processRequests: true,
    approveReject: true,
    generateDocuments: true,
    archiveDocuments: true,
    bulkActions: true,
  },
  Staff: {
    processRequests: true,
    approveReject: true,
    generateDocuments: true,
    archiveDocuments: false,
    bulkActions: true,
  },
  Viewer: {
    processRequests: false,
    approveReject: false,
    generateDocuments: false,
    archiveDocuments: false,
    bulkActions: false,
  },
};

const SEED_RESIDENTS: ResidentLite[] = [
  { id: "RES-2026-0001", fullName: "Maria Lopez Santos", purok: "Purok 1" },
  { id: "RES-2026-0002", fullName: "Juan Reyes Dela Cruz", purok: "Purok 2" },
  { id: "RES-2026-0003", fullName: "Ana Garcia Reyes", purok: "Purok 3" },
  { id: "RES-2026-0004", fullName: "Pedro Cruz Luna", purok: "Purok 1" },
  { id: "RES-2026-0005", fullName: "Carla Mendoza Rivera", purok: "Purok 4" },
  { id: "RES-2026-0007", fullName: "Mark Lim Aquino", purok: "Purok 2" },
];

const SEED_REQUESTS: DocumentRequest[] = [
  {
    id: "REQ-2026-00001",
    residentId: "RES-2026-0001",
    documentType: "Barangay Clearance",
    purpose: "Local employment requirement",
    requestedAt: "2026-04-20T08:50:00.000Z",
    status: "Pending",
  },
  {
    id: "REQ-2026-00002",
    residentId: "RES-2026-0002",
    documentType: "Certificate of Indigency",
    purpose: "Medical assistance application",
    requestedAt: "2026-04-19T03:20:00.000Z",
    status: "Processing",
    assignedTo: "Rico Santos",
  },
  {
    id: "REQ-2026-00003",
    residentId: "RES-2026-0005",
    documentType: "Certificate of Residency",
    purpose: "School scholarship submission",
    requestedAt: "2026-04-18T13:42:00.000Z",
    status: "Approved",
    assignedTo: "Aira Flores",
    generatedDocumentId: "DOC-2026-00001",
  },
  {
    id: "REQ-2026-00004",
    residentId: "RES-2026-0004",
    documentType: "Certificate of Good Moral",
    purpose: "Police clearance requirement",
    requestedAt: "2026-04-17T10:10:00.000Z",
    status: "Rejected",
    remarks: "Incomplete supporting attachment",
  },
  {
    id: "REQ-2026-00005",
    residentId: "RES-2026-0007",
    documentType: "Business Endorsement",
    purpose: "Barangay endorsement for permit renewal",
    requestedAt: "2026-04-16T05:30:00.000Z",
    status: "Pending",
  },
];

const SEED_DOCUMENTS: GeneratedDocument[] = [
  {
    id: "DOC-ROW-001",
    code: "DOC-2026-00001",
    requestId: "REQ-2026-00003",
    residentId: "RES-2026-0005",
    documentType: "Certificate of Residency",
    purpose: "School scholarship submission",
    generatedBy: "Aira Flores",
    generatedAt: "2026-04-18T14:12:00.000Z",
    validUntil: "2027-04-18T14:12:00.000Z",
    status: "Released",
  },
  {
    id: "DOC-ROW-002",
    code: "DOC-2026-00002",
    requestId: "REQ-2026-09900",
    residentId: "RES-2026-0002",
    documentType: "Certificate of Indigency",
    purpose: "Hospital social worker endorsement",
    generatedBy: "Pauline Seitz",
    generatedAt: "2026-04-12T09:25:00.000Z",
    status: "Generated",
  },
  {
    id: "DOC-ROW-003",
    code: "DOC-2026-00003",
    requestId: "REQ-2026-08812",
    residentId: "RES-2026-0001",
    documentType: "Barangay Clearance",
    purpose: "Job application",
    generatedBy: "Miguel Ramos",
    generatedAt: "2026-03-28T02:45:00.000Z",
    validUntil: "2026-09-24T02:45:00.000Z",
    status: "Archived",
  },
];

const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: "ACT-000001",
    actor: "Aira Flores",
    action: "Generated",
    entityType: "document",
    entityId: "DOC-2026-00001",
    message: "Generated Certificate of Residency for Carla Mendoza Rivera.",
    createdAt: "2026-04-18T14:12:00.000Z",
  },
  {
    id: "ACT-000002",
    actor: "Rico Santos",
    action: "Processing",
    entityType: "request",
    entityId: "REQ-2026-00002",
    message: "Moved request REQ-2026-00002 to Processing.",
    createdAt: "2026-04-19T03:35:00.000Z",
  },
];

export function DocumentsWorkflowPage() {
  const [snapshotTime] = useState(() => Date.now());
  const [role, setRole] = useState<UserRole>("Admin");
  const [activeTab, setActiveTab] = useState<(typeof TAB_OPTIONS)[number]>("Requests");
  const [requests, setRequests] = useState<DocumentRequest[]>(SEED_REQUESTS);
  const [documents, setDocuments] = useState<GeneratedDocument[]>(SEED_DOCUMENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(SEED_ACTIVITIES);
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(new Set());
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(new Set());
  const [viewRequest, setViewRequest] = useState<DocumentRequest | null>(null);
  const [viewDocument, setViewDocument] = useState<GeneratedDocument | null>(null);

  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<"All" | RequestStatus>("All");
  const [requestTypeFilter, setRequestTypeFilter] = useState<"All" | DocumentType>("All");
  const [requestFrom, setRequestFrom] = useState("");
  const [requestTo, setRequestTo] = useState("");
  const [requestSortBy, setRequestSortBy] = useState<"date" | "name" | "type">("date");
  const [requestSortDirection, setRequestSortDirection] = useState<"asc" | "desc">("desc");
  const [requestPage, setRequestPage] = useState(1);

  const [documentSearch, setDocumentSearch] = useState("");
  const [documentStatusFilter, setDocumentStatusFilter] = useState<"All" | GeneratedStatus>("All");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<"All" | DocumentType>("All");
  const [documentFrom, setDocumentFrom] = useState("");
  const [documentTo, setDocumentTo] = useState("");
  const [documentSortBy, setDocumentSortBy] = useState<"date" | "name" | "type">("date");
  const [documentSortDirection, setDocumentSortDirection] = useState<"asc" | "desc">("desc");
  const [documentPage, setDocumentPage] = useState(1);

  const permissions = ROLE_PERMISSIONS[role];
  const currentActor = role === "Viewer" ? "Read Only User" : "Pauline Seitz";
  const residentsMap = useMemo(() => new Map(SEED_RESIDENTS.map((resident) => [resident.id, resident])), []);

  const filteredRequests = useMemo(() => {
    const filtered = requests
      .filter((request) => requestMatchesSearch(request, residentsMap.get(request.residentId), requestSearch))
      .filter((request) => requestStatusFilter === "All" || request.status === requestStatusFilter)
      .filter((request) => requestTypeFilter === "All" || request.documentType === requestTypeFilter)
      .filter((request) => inRange(request.requestedAt, requestFrom, requestTo));
    return sortRequests(filtered, residentsMap, requestSortBy, requestSortDirection);
  }, [
    requestFrom,
    requestSearch,
    requestSortBy,
    requestSortDirection,
    requestStatusFilter,
    requestTo,
    requestTypeFilter,
    requests,
    residentsMap,
  ]);

  const filteredDocuments = useMemo(() => {
    const filtered = documents
      .filter((document) => documentMatchesSearch(document, residentsMap.get(document.residentId), documentSearch))
      .filter((document) => documentStatusFilter === "All" || document.status === documentStatusFilter)
      .filter((document) => documentTypeFilter === "All" || document.documentType === documentTypeFilter)
      .filter((document) => inRange(document.generatedAt, documentFrom, documentTo));
    return sortDocuments(filtered, residentsMap, documentSortBy, documentSortDirection);
  }, [
    documentFrom,
    documentSearch,
    documentSortBy,
    documentSortDirection,
    documentStatusFilter,
    documentTo,
    documentTypeFilter,
    documents,
    residentsMap,
  ]);

  const requestRowsPerPage = 8;
  const documentRowsPerPage = 8;

  const requestPages = Math.max(1, Math.ceil(filteredRequests.length / requestRowsPerPage));
  const documentPages = Math.max(1, Math.ceil(filteredDocuments.length / documentRowsPerPage));
  const safeRequestPage = Math.min(requestPage, requestPages);
  const safeDocumentPage = Math.min(documentPage, documentPages);

  const paginatedRequests = filteredRequests.slice(
    (safeRequestPage - 1) * requestRowsPerPage,
    safeRequestPage * requestRowsPerPage
  );
  const paginatedDocuments = filteredDocuments.slice(
    (safeDocumentPage - 1) * documentRowsPerPage,
    safeDocumentPage * documentRowsPerPage
  );

  const summary = useMemo(() => {
    const pending = requests.filter((request) => request.status === "Pending").length;
    const processing = requests.filter((request) => request.status === "Processing").length;
    const rejected = requests.filter((request) => request.status === "Rejected").length;
    const generated = documents.filter((document) => document.status === "Generated").length;
    const released = documents.filter((document) => document.status === "Released").length;
    const archived = documents.filter((document) => document.status === "Archived").length;
    const recentGenerated = documents.filter(
      (document) => snapshotTime - new Date(document.generatedAt).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;
    return {
      pending,
      processing,
      rejected,
      generated,
      released,
      archived,
      recentGenerated,
    };
  }, [documents, requests, snapshotTime]);

  const residentDocumentHistory = useMemo(() => {
    const map = new Map<string, GeneratedDocument[]>();
    documents.forEach((document) => {
      const entries = map.get(document.residentId) ?? [];
      entries.push(document);
      map.set(document.residentId, entries);
    });
    return map;
  }, [documents]);

  function addActivity(entry: Omit<ActivityLog, "id" | "createdAt">) {
    setActivities((previous) => [
      {
        ...entry,
        id: createActivityId(previous),
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
  }

  function updateRequestStatus(id: string, status: RequestStatus, remarks?: string) {
    setRequests((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              remarks: remarks ?? item.remarks,
              assignedTo: item.assignedTo || (status === "Processing" ? currentActor : item.assignedTo),
            }
          : item
      )
    );
    addActivity({
      actor: currentActor,
      action: status,
      entityType: "request",
      entityId: id,
      message: `Set ${id} to ${status}${remarks ? ` (${remarks})` : ""}.`,
    });
  }

  function assignRequest(id: string, staff: string) {
    setRequests((previous) => previous.map((item) => (item.id === id ? { ...item, assignedTo: staff } : item)));
    addActivity({
      actor: currentActor,
      action: "Assigned",
      entityType: "request",
      entityId: id,
      message: `Assigned ${id} to ${staff}.`,
    });
  }

  function generateFromRequest(requestId: string) {
    if (!permissions.generateDocuments) return;

    const request = requests.find((item) => item.id === requestId);
    if (!request) return;

    const now = new Date().toISOString();
    const code = createDocumentCode(documents);
    const generatedId = `DOC-ROW-${Date.now()}`;
    const nextDocument: GeneratedDocument = {
      id: generatedId,
      code,
      requestId: request.id,
      residentId: request.residentId,
      documentType: request.documentType,
      purpose: request.purpose,
      generatedBy: currentActor,
      generatedAt: now,
      validUntil: getValidityDate(request.documentType, now),
      status: "Generated",
    };

    setDocuments((previous) => [nextDocument, ...previous]);
    setRequests((previous) =>
      previous.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Approved",
              assignedTo: item.assignedTo || currentActor,
              generatedDocumentId: generatedId,
            }
          : item
      )
    );

    addActivity({
      actor: currentActor,
      action: "Generated",
      entityType: "document",
      entityId: code,
      message: `Generated ${request.documentType} (${code}) from request ${request.id}.`,
    });
  }

  function updateGeneratedStatus(id: string, status: GeneratedStatus) {
    if (status === "Archived" && !permissions.archiveDocuments) return;
    setDocuments((previous) => previous.map((item) => (item.id === id ? { ...item, status } : item)));
    const target = documents.find((item) => item.id === id);
    if (!target) return;
    addActivity({
      actor: currentActor,
      action: status,
      entityType: "document",
      entityId: target.code,
      message: `Set ${target.code} to ${status}.`,
    });
  }

  function regenerateDocument(source: GeneratedDocument) {
    if (!permissions.generateDocuments) return;
    updateGeneratedStatus(source.id, "Archived");
    const now = new Date().toISOString();
    const code = createDocumentCode(documents);
    const regenerated: GeneratedDocument = {
      ...source,
      id: `DOC-ROW-${Date.now()}`,
      code,
      generatedAt: now,
      generatedBy: currentActor,
      status: "Generated",
    };
    setDocuments((previous) => [regenerated, ...previous]);
    addActivity({
      actor: currentActor,
      action: "Regenerated",
      entityType: "document",
      entityId: code,
      message: `Regenerated ${source.documentType} into ${code} from ${source.code}.`,
    });
  }

  function downloadDocument(document: GeneratedDocument) {
    const resident = residentsMap.get(document.residentId);
    downloadMockPdf(`${document.code}.pdf`, [
      "Barangay Management System",
      "Generated Certificate",
      `Document Code: ${document.code}`,
      `Resident: ${resident?.fullName ?? document.residentId}`,
      `Type: ${document.documentType}`,
      `Purpose: ${document.purpose}`,
      `Generated By: ${document.generatedBy}`,
      `Generated At: ${formatDateTime(document.generatedAt)}`,
      `Validity: ${document.validUntil ? formatDate(document.validUntil) : "N/A"}`,
    ]);
    addActivity({
      actor: currentActor,
      action: "Downloaded",
      entityType: "document",
      entityId: document.code,
      message: `Downloaded PDF for ${document.code}.`,
    });
  }

  function printDocument(document: GeneratedDocument) {
    const resident = residentsMap.get(document.residentId);
    const printWindow = window.open("", "_blank", "width=900,height=720");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>${document.code}</title></head>
        <body style="font-family:Arial;padding:24px;color:#111">
          <h2>Barangay Management System</h2>
          <h3>${document.documentType}</h3>
          <p><strong>Document Code:</strong> ${document.code}</p>
          <p><strong>Resident:</strong> ${resident?.fullName ?? document.residentId}</p>
          <p><strong>Purpose:</strong> ${document.purpose}</p>
          <p><strong>Generated By:</strong> ${document.generatedBy}</p>
          <p><strong>Date Generated:</strong> ${formatDateTime(document.generatedAt)}</p>
          <p><strong>Validity:</strong> ${document.validUntil ? formatDate(document.validUntil) : "N/A"}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    addActivity({
      actor: currentActor,
      action: "Printed",
      entityType: "document",
      entityId: document.code,
      message: `Printed ${document.code}.`,
    });
  }

  function simulateNewRequest() {
    if (!permissions.processRequests) return;
    const resident = SEED_RESIDENTS[Math.floor(Math.random() * SEED_RESIDENTS.length)];
    const type = DOCUMENT_TYPES[Math.floor(Math.random() * DOCUMENT_TYPES.length)];
    const next: DocumentRequest = {
      id: createRequestId(requests),
      residentId: resident.id,
      documentType: type,
      purpose: "Walk-in resident request",
      requestedAt: new Date().toISOString(),
      status: "Pending",
    };
    setRequests((previous) => [next, ...previous]);
    addActivity({
      actor: currentActor,
      action: "Created",
      entityType: "request",
      entityId: next.id,
      message: `Created new request ${next.id} for ${resident.fullName}.`,
    });
  }

  function exportDocumentSelection() {
    const selected = documents.filter((document) => selectedDocumentIds.has(document.id));
    if (selected.length === 0) return;
    const rows = [
      ["Document Code", "Resident", "Type", "Purpose", "Generated By", "Generated Date", "Status"],
      ...selected.map((document) => [
        document.code,
        residentsMap.get(document.residentId)?.fullName ?? document.residentId,
        document.documentType,
        document.purpose,
        document.generatedBy,
        formatDateTime(document.generatedAt),
        document.status,
      ]),
    ];
    exportCsv(`documents-export-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  function bulkArchive() {
    if (!permissions.archiveDocuments || selectedDocumentIds.size === 0) return;
    setDocuments((previous) =>
      previous.map((document) =>
        selectedDocumentIds.has(document.id) ? { ...document, status: "Archived" } : document
      )
    );
    setSelectedDocumentIds(new Set());
  }

  function requestTypeCounts() {
    return DOCUMENT_TYPES.map((type) => ({
      type,
      count: requests.filter((request) => request.documentType === type).length,
    }));
  }

  function staffOutput() {
    return STAFF_MEMBERS.map((staff) => ({
      staff,
      generated: documents.filter((document) => document.generatedBy === staff).length,
      assigned: requests.filter((request) => request.assignedTo === staff).length,
    }));
  }

  return (
    <section className="space-y-6">
      <header className="space-y-4 px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Documents & Certificates</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              End-to-end workflow for incoming requests, certificate generation, and audit-ready activity tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
              Role
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="rounded-md bg-transparent text-[var(--text)] outline-none"
              >
                <option>Admin</option>
                <option>Staff</option>
                <option>Viewer</option>
              </select>
            </label>

            <button
              type="button"
              onClick={simulateNewRequest}
              disabled={!permissions.processRequests}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <BellRing className="h-4 w-4" />
              Simulate New Request
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={Clock3} label="Pending Requests" value={summary.pending} tone="amber" />
          <SummaryCard icon={FileCog} label="Processing" value={summary.processing} tone="blue" />
          <SummaryCard icon={FileCheck2} label="Generated This Week" value={summary.recentGenerated} tone="emerald" />
          <SummaryCard icon={XCircle} label="Rejected Requests" value={summary.rejected} tone="rose" />
        </div>

        <div className="flex flex-wrap gap-2">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all",
                activeTab === tab
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === "Requests" ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-2 xl:grid-cols-6">
            <label className="xl:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={requestSearch}
                  onChange={(event) => {
                    setRequestSearch(event.target.value);
                    setRequestPage(1);
                  }}
                  placeholder="Resident, request ID, purpose, type"
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                />
              </div>
            </label>

            <FilterSelect
              label="Status"
              value={requestStatusFilter}
              options={REQUEST_STATUS_OPTIONS}
              onChange={(value) => {
                setRequestStatusFilter(value as "All" | RequestStatus);
                setRequestPage(1);
              }}
            />

            <FilterSelect
              label="Type"
              value={requestTypeFilter}
              options={["All", ...DOCUMENT_TYPES]}
              onChange={(value) => {
                setRequestTypeFilter(value as "All" | DocumentType);
                setRequestPage(1);
              }}
            />

            <label>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">From</span>
              <input
                type="date"
                value={requestFrom}
                onChange={(event) => setRequestFrom(event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </label>

            <label>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">To</span>
              <input
                type="date"
                value={requestTo}
                onChange={(event) => setRequestTo(event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredRequests.length} requests • Page {safeRequestPage} of {requestPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SortButton
                label={`Sort: ${requestSortBy}`}
                onClick={() => {
                  if (requestSortBy === "date") setRequestSortBy("name");
                  if (requestSortBy === "name") setRequestSortBy("type");
                  if (requestSortBy === "type") setRequestSortBy("date");
                }}
              />
              <SortButton
                label={requestSortDirection === "asc" ? "Ascending" : "Descending"}
                onClick={() => setRequestSortDirection((value) => (value === "asc" ? "desc" : "asc"))}
              />
              <button
                type="button"
                onClick={() =>
                  setSelectedRequestIds(new Set(paginatedRequests.map((request) => request.id)))
                }
                disabled={!permissions.bulkActions}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold hover:border-[var(--primary)]/40 disabled:opacity-40"
              >
                Select Page
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/70 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Resident</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/40">
                {paginatedRequests.map((request) => {
                  const resident = residentsMap.get(request.residentId);
                  const disabledActions = role === "Viewer";
                  return (
                    <tr key={request.id} className="align-top">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRequestIds.has(request.id)}
                          onChange={(event) => {
                            setSelectedRequestIds((previous) => {
                              const next = new Set(previous);
                              if (event.target.checked) next.add(request.id);
                              else next.delete(request.id);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--text)]">{request.id}</p>
                        <p className="text-xs text-[var(--muted)]">{request.documentType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/residents?search=${request.residentId}`} className="font-semibold text-[var(--primary)]">
                          {resident?.fullName ?? request.residentId}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">{resident?.purok ?? "No purok data"}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{request.purpose}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{formatDateTime(request.requestedAt)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={request.assignedTo ?? ""}
                          onChange={(event) => assignRequest(request.id, event.target.value)}
                          disabled={disabledActions}
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1 text-xs text-[var(--text)] disabled:opacity-50"
                        >
                          <option value="">Unassigned</option>
                          {STAFF_MEMBERS.map((staff) => (
                            <option key={staff} value={staff}>
                              {staff}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", requestStatusTone(request.status))}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <ActionButton icon={Eye} label="View" onClick={() => setViewRequest(request)} />
                          <ActionButton
                            icon={Clock3}
                            label="Process"
                            disabled={disabledActions || !permissions.processRequests}
                            onClick={() => updateRequestStatus(request.id, "Processing")}
                          />
                          <ActionButton
                            icon={CheckCircle2}
                            label="Approve"
                            disabled={disabledActions || !permissions.approveReject}
                            onClick={() => updateRequestStatus(request.id, "Approved")}
                          />
                          <ActionButton
                            icon={XCircle}
                            label="Reject"
                            disabled={disabledActions || !permissions.approveReject}
                            onClick={() => updateRequestStatus(request.id, "Rejected", "Rejected by staff review")}
                          />
                          <ActionButton
                            icon={FileText}
                            label="Generate"
                            disabled={disabledActions || !permissions.generateDocuments || request.status === "Rejected"}
                            onClick={() => generateFromRequest(request.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => selectedRequestIds.forEach((id) => updateRequestStatus(id, "Processing"))}
                disabled={!permissions.bulkActions || selectedRequestIds.size === 0}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
              >
                Bulk Processing
              </button>
              <button
                type="button"
                onClick={() => selectedRequestIds.forEach((id) => updateRequestStatus(id, "Approved"))}
                disabled={!permissions.bulkActions || selectedRequestIds.size === 0}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
              >
                Bulk Approve
              </button>
              <button
                type="button"
                onClick={() => setSelectedRequestIds(new Set())}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40"
              >
                Clear Selection
              </button>
            </div>
            <Pagination
              page={safeRequestPage}
              pages={requestPages}
              onPrevious={() => setRequestPage((value) => Math.max(1, value - 1))}
              onNext={() => setRequestPage((value) => Math.min(requestPages, value + 1))}
            />
          </div>
        </section>
      ) : null}

      {activeTab === "Generated Documents" ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid gap-3 border-b border-[var(--border)] p-4 md:grid-cols-2 xl:grid-cols-6">
            <label className="xl:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={documentSearch}
                  onChange={(event) => {
                    setDocumentSearch(event.target.value);
                    setDocumentPage(1);
                  }}
                  placeholder="Document code, resident, type, purpose"
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
                />
              </div>
            </label>

            <FilterSelect
              label="Status"
              value={documentStatusFilter}
              options={GENERATED_STATUS_OPTIONS}
              onChange={(value) => {
                setDocumentStatusFilter(value as "All" | GeneratedStatus);
                setDocumentPage(1);
              }}
            />

            <FilterSelect
              label="Type"
              value={documentTypeFilter}
              options={["All", ...DOCUMENT_TYPES]}
              onChange={(value) => {
                setDocumentTypeFilter(value as "All" | DocumentType);
                setDocumentPage(1);
              }}
            />

            <label>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">From</span>
              <input
                type="date"
                value={documentFrom}
                onChange={(event) => setDocumentFrom(event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </label>
            <label>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">To</span>
              <input
                type="date"
                value={documentTo}
                onChange={(event) => setDocumentTo(event.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredDocuments.length} generated documents • Page {safeDocumentPage} of {documentPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SortButton
                label={`Sort: ${documentSortBy}`}
                onClick={() => {
                  if (documentSortBy === "date") setDocumentSortBy("name");
                  if (documentSortBy === "name") setDocumentSortBy("type");
                  if (documentSortBy === "type") setDocumentSortBy("date");
                }}
              />
              <SortButton
                label={documentSortDirection === "asc" ? "Ascending" : "Descending"}
                onClick={() => setDocumentSortDirection((value) => (value === "asc" ? "desc" : "asc"))}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/70 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Document Code</th>
                  <th className="px-4 py-3">Resident</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Generated By</th>
                  <th className="px-4 py-3">Generated Date</th>
                  <th className="px-4 py-3">Validity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/40">
                {paginatedDocuments.map((document) => {
                  const resident = residentsMap.get(document.residentId);
                  return (
                    <tr key={document.id}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDocumentIds.has(document.id)}
                          onChange={(event) => {
                            setSelectedDocumentIds((previous) => {
                              const next = new Set(previous);
                              if (event.target.checked) next.add(document.id);
                              else next.delete(document.id);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--text)]">{document.code}</p>
                        <p className="text-xs text-[var(--muted)]">{document.documentType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/residents?search=${document.residentId}`} className="font-semibold text-[var(--primary)]">
                          {resident?.fullName ?? document.residentId}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">{resident?.purok ?? "No purok data"}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{document.purpose}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{document.generatedBy}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{formatDateTime(document.generatedAt)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {document.validUntil ? formatDate(document.validUntil) : "No expiry"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", documentStatusTone(document.status))}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <ActionButton icon={Eye} label="View" onClick={() => setViewDocument(document)} />
                          <ActionButton icon={Download} label="PDF" onClick={() => downloadDocument(document)} />
                          <ActionButton icon={Printer} label="Print" onClick={() => printDocument(document)} />
                          <ActionButton
                            icon={RefreshCcw}
                            label="Re-gen"
                            disabled={!permissions.generateDocuments}
                            onClick={() => regenerateDocument(document)}
                          />
                          <ActionButton
                            icon={CheckCircle2}
                            label="Release"
                            onClick={() => updateGeneratedStatus(document.id, "Released")}
                          />
                          <ActionButton
                            icon={Archive}
                            label="Archive"
                            disabled={!permissions.archiveDocuments}
                            onClick={() => updateGeneratedStatus(document.id, "Archived")}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exportDocumentSelection}
                disabled={!permissions.bulkActions || selectedDocumentIds.size === 0}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
              >
                Export Selected
              </button>
              <button
                type="button"
                onClick={bulkArchive}
                disabled={!permissions.archiveDocuments || selectedDocumentIds.size === 0}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
              >
                Archive Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocumentIds(new Set())}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40"
              >
                Clear Selection
              </button>
            </div>

            <Pagination
              page={safeDocumentPage}
              pages={documentPages}
              onPrevious={() => setDocumentPage((value) => Math.max(1, value - 1))}
              onNext={() => setDocumentPage((value) => Math.min(documentPages, value + 1))}
            />
          </div>
        </section>
      ) : null}

      {activeTab === "Analytics" ? (
        <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Request Volume By Type</h2>
            <div className="mt-4 space-y-3">
              {requestTypeCounts().map((row) => (
                <div key={row.type}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text)]">{row.type}</span>
                    <span className="text-[var(--muted)]">{row.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--card-soft)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{
                        width: `${Math.max(6, (row.count / Math.max(1, requests.length)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Staff Productivity</h2>
            <div className="mt-4 space-y-3">
              {staffOutput().map((staff) => (
                <div key={staff.staff} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{staff.staff}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
                    <span>Assigned: {staff.assigned}</span>
                    <span>Generated: {staff.generated}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Recent Activity</h2>
          <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Audit Log
          </span>
        </div>
        <div className="mt-4 max-h-72 space-y-2 overflow-auto">
          {activities.slice(0, 12).map((activity) => (
            <div key={activity.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2">
              <p className="text-sm text-[var(--text)]">{activity.message}</p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">
                {activity.actor} • {formatDateTime(activity.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {viewRequest ? (
        <Modal title={`Request Details • ${viewRequest.id}`} onClose={() => setViewRequest(null)}>
          <DetailGrid
            items={[
              { label: "Request ID", value: viewRequest.id },
              { label: "Resident", value: residentsMap.get(viewRequest.residentId)?.fullName ?? viewRequest.residentId },
              { label: "Document Type", value: viewRequest.documentType },
              { label: "Purpose", value: viewRequest.purpose },
              { label: "Date Requested", value: formatDateTime(viewRequest.requestedAt) },
              { label: "Assigned To", value: viewRequest.assignedTo || "Unassigned" },
              { label: "Status", value: viewRequest.status },
              { label: "Remarks", value: viewRequest.remarks || "None" },
            ]}
          />
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Resident Document History</h3>
            <div className="mt-2 space-y-2">
              {(residentDocumentHistory.get(viewRequest.residentId) ?? []).map((document) => (
                <div key={document.id} className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)]">
                  {document.code} • {document.documentType} • {formatDate(document.generatedAt)}
                </div>
              ))}
              {(residentDocumentHistory.get(viewRequest.residentId) ?? []).length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No previous documents for this resident.</p>
              ) : null}
            </div>
          </div>
        </Modal>
      ) : null}

      {viewDocument ? (
        <Modal title={`Generated Document • ${viewDocument.code}`} onClose={() => setViewDocument(null)}>
          <DetailGrid
            items={[
              { label: "Document Code", value: viewDocument.code },
              { label: "Request ID", value: viewDocument.requestId },
              { label: "Resident", value: residentsMap.get(viewDocument.residentId)?.fullName ?? viewDocument.residentId },
              { label: "Type", value: viewDocument.documentType },
              { label: "Purpose", value: viewDocument.purpose },
              { label: "Generated By", value: viewDocument.generatedBy },
              { label: "Date Generated", value: formatDateTime(viewDocument.generatedAt) },
              { label: "Validity", value: viewDocument.validUntil ? formatDate(viewDocument.validUntil) : "No expiry" },
              { label: "Status", value: viewDocument.status },
            ]}
          />
        </Modal>
      ) : null}
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "amber" | "blue" | "emerald" | "rose";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/5 text-amber-600"
      : tone === "blue"
        ? "border-indigo-300/30 bg-indigo-500/5 text-indigo-600"
        : tone === "rose"
          ? "border-rose-300/30 bg-rose-500/5 text-rose-600"
          : "border-emerald-300/30 bg-emerald-500/5 text-emerald-600";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <div className={cn("rounded-lg border p-2", toneClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
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

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold text-[var(--text)] hover:border-[var(--primary)]/40"
    >
      <ArrowUpDown className="h-3.5 w-3.5 text-[var(--primary)]" />
      {label}
    </button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text)] transition hover:border-[var(--primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Pagination({
  page,
  pages,
  onPrevious,
  onNext,
}: {
  page: number;
  pages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 1}
        className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-[var(--muted)]">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page === pages}
        className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold text-[var(--text)] hover:border-[var(--primary)]/40 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{item.label}</p>
          <p className="mt-1 text-sm text-[var(--text)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
