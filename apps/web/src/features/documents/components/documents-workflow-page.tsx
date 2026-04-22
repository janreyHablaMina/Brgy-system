"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  ArrowUpDown,
  BellRing,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileCog,
  FileDown,
  FileText,
  Filter,
  Layers3,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ActivityLog,
  DocumentRequest,
  DocumentSource,
  DocumentType,
  EntityRecord,
  GeneratedDocument,
  GeneratedStatus,
  RequestStatus,
  UserRole,
} from "../types";
import {
  createActivityId,
  createDocumentCode,
  createRequestId,
  documentMatchesSearch,
  documentStatusTone,
  downloadMockPdf,
  entityKey,
  exportCsv,
  formatDate,
  formatDateTime,
  getValidityDate,
  inRange,
  requestMatchesSearch,
  requestStatusTone,
  sortDocuments,
  sortRequests,
  sourceTone,
} from "../utils";

const DOCUMENT_TYPES: DocumentType[] = [
  "Barangay Clearance",
  "Certificate of Indigency",
  "Certificate of Residency",
  "Business Endorsement",
  "Certificate of Good Moral",
];

const SOURCES: DocumentSource[] = [
  "Residents",
  "Establishments",
  "Lots / Buildings",
  "Case Records / VAWC",
];

const STAFF_MEMBERS = ["Pauline Seitz", "Rico Santos", "Aira Flores", "Miguel Ramos"];
const REQUEST_STATUS_OPTIONS: Array<"All" | RequestStatus> = ["All", "Pending", "Processing", "Approved", "Rejected"];
const GENERATED_STATUS_OPTIONS: Array<"All" | GeneratedStatus> = ["All", "Generated", "Released", "Archived"];
const VIEW_TABS = ["Requests", "Generated Documents", "Analytics"] as const;
const WORKFLOW_STEPS = ["Request", "Processing", "Approved", "Generated", "Released"] as const;

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

const ENTITY_SEED: EntityRecord[] = [
  { id: "RES-2026-0001", source: "Residents", displayName: "Maria Lopez Santos", subtitle: "Purok 1", href: "/residents?search=RES-2026-0001" },
  { id: "RES-2026-0002", source: "Residents", displayName: "Juan Reyes Dela Cruz", subtitle: "Purok 2", href: "/residents?search=RES-2026-0002" },
  { id: "RES-2026-0005", source: "Residents", displayName: "Carla Mendoza Rivera", subtitle: "Purok 4", href: "/residents?search=RES-2026-0005" },
  { id: "EST-2026-0001", source: "Establishments", displayName: "Salaza Mart", subtitle: "Retail | Purok 1", href: "/establishments?search=EST-2026-0001" },
  { id: "EST-2026-0002", source: "Establishments", displayName: "Kusina ni Liza", subtitle: "Food & Beverage | Purok 2", href: "/establishments?search=EST-2026-0002" },
  { id: "LOT-2026-0001", source: "Lots / Buildings", displayName: "Lot 12 Block 4", subtitle: "Purok 3 | Tax Dec 2026-3321", href: "/reports" },
  { id: "CASE-2026-0009", source: "Case Records / VAWC", displayName: "Case Referral 2026-0009", subtitle: "VAWC | Confidential Record", href: "/reports" },
];

const REQUEST_SEED: DocumentRequest[] = [
  {
    id: "REQ-2026-00001",
    source: "Residents",
    entityId: "RES-2026-0001",
    documentType: "Barangay Clearance",
    purpose: "Local employment requirement",
    requestedAt: "2026-04-20T08:50:00.000Z",
    status: "Pending",
  },
  {
    id: "REQ-2026-00002",
    source: "Residents",
    entityId: "RES-2026-0002",
    documentType: "Certificate of Indigency",
    purpose: "Medical assistance application",
    requestedAt: "2026-04-19T03:20:00.000Z",
    status: "Processing",
    assignedTo: "Rico Santos",
  },
  {
    id: "REQ-2026-00003",
    source: "Residents",
    entityId: "RES-2026-0005",
    documentType: "Certificate of Residency",
    purpose: "School scholarship submission",
    requestedAt: "2026-04-18T13:42:00.000Z",
    status: "Approved",
    assignedTo: "Aira Flores",
    generatedDocumentId: "DOC-ROW-001",
  },
  {
    id: "REQ-2026-00004",
    source: "Establishments",
    entityId: "EST-2026-0001",
    documentType: "Business Endorsement",
    purpose: "Permit renewal endorsement",
    requestedAt: "2026-04-17T10:10:00.000Z",
    status: "Processing",
    assignedTo: "Miguel Ramos",
  },
  {
    id: "REQ-2026-00005",
    source: "Lots / Buildings",
    entityId: "LOT-2026-0001",
    documentType: "Barangay Clearance",
    purpose: "Lot occupancy validation",
    requestedAt: "2026-04-16T05:30:00.000Z",
    status: "Pending",
  },
  {
    id: "REQ-2026-00006",
    source: "Case Records / VAWC",
    entityId: "CASE-2026-0009",
    documentType: "Certificate of Indigency",
    purpose: "Legal aid support documentation",
    requestedAt: "2026-04-16T02:30:00.000Z",
    status: "Rejected",
    remarks: "Requires additional referral form",
  },
];

const DOCUMENT_SEED: GeneratedDocument[] = [
  {
    id: "DOC-ROW-001",
    code: "DOC-2026-00001",
    requestId: "REQ-2026-00003",
    source: "Residents",
    entityId: "RES-2026-0005",
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
    requestId: "REQ-2026-00004",
    source: "Establishments",
    entityId: "EST-2026-0001",
    documentType: "Business Endorsement",
    purpose: "Permit renewal endorsement",
    generatedBy: "Miguel Ramos",
    generatedAt: "2026-04-17T11:00:00.000Z",
    status: "Generated",
  },
  {
    id: "DOC-ROW-003",
    code: "DOC-2026-00003",
    requestId: "REQ-2026-08812",
    source: "Residents",
    entityId: "RES-2026-0001",
    documentType: "Barangay Clearance",
    purpose: "Job application",
    generatedBy: "Pauline Seitz",
    generatedAt: "2026-03-28T02:45:00.000Z",
    validUntil: "2026-09-24T02:45:00.000Z",
    status: "Archived",
  },
];

const ACTIVITY_SEED: ActivityLog[] = [
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
  const [activeSource, setActiveSource] = useState<DocumentSource>("Residents");
  const [activeTab, setActiveTab] = useState<(typeof VIEW_TABS)[number]>("Requests");

  const [requests, setRequests] = useState<DocumentRequest[]>(REQUEST_SEED);
  const [documents, setDocuments] = useState<GeneratedDocument[]>(DOCUMENT_SEED);
  const [activities, setActivities] = useState<ActivityLog[]>(ACTIVITY_SEED);

  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(new Set());
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(new Set());
  const [bulkAssignTo, setBulkAssignTo] = useState("");
  const [showRequestFilters, setShowRequestFilters] = useState(false);
  const [showDocumentFilters, setShowDocumentFilters] = useState(false);

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
  const entityMap = useMemo(() => new Map(ENTITY_SEED.map((entity) => [entityKey(entity.source, entity.id), entity])), []);

  const requestRows = useMemo(
    () =>
      requests.filter((request) => request.source === activeSource).filter((request) =>
        requestMatchesSearch(request, entityMap.get(entityKey(request.source, request.entityId)), requestSearch)
      )
        .filter((request) => requestStatusFilter === "All" || request.status === requestStatusFilter)
        .filter((request) => requestTypeFilter === "All" || request.documentType === requestTypeFilter)
        .filter((request) => inRange(request.requestedAt, requestFrom, requestTo)),
    [activeSource, entityMap, requestFrom, requestSearch, requestStatusFilter, requestTo, requestTypeFilter, requests]
  );

  const filteredRequests = useMemo(
    () => sortRequests(requestRows, entityMap, requestSortBy, requestSortDirection),
    [entityMap, requestRows, requestSortBy, requestSortDirection]
  );

  const documentRows = useMemo(
    () =>
      documents.filter((document) => document.source === activeSource).filter((document) =>
        documentMatchesSearch(document, entityMap.get(entityKey(document.source, document.entityId)), documentSearch)
      )
        .filter((document) => documentStatusFilter === "All" || document.status === documentStatusFilter)
        .filter((document) => documentTypeFilter === "All" || document.documentType === documentTypeFilter)
        .filter((document) => inRange(document.generatedAt, documentFrom, documentTo)),
    [activeSource, documentFrom, documentSearch, documentStatusFilter, documentTo, documentTypeFilter, documents, entityMap]
  );

  const filteredDocuments = useMemo(
    () => sortDocuments(documentRows, entityMap, documentSortBy, documentSortDirection),
    [documentRows, entityMap, documentSortBy, documentSortDirection]
  );

  const requestRowsPerPage = 8;
  const documentRowsPerPage = 8;
  const requestPages = Math.max(1, Math.ceil(filteredRequests.length / requestRowsPerPage));
  const documentPages = Math.max(1, Math.ceil(filteredDocuments.length / documentRowsPerPage));
  const safeRequestPage = Math.min(requestPage, requestPages);
  const safeDocumentPage = Math.min(documentPage, documentPages);
  const paginatedRequests = filteredRequests.slice((safeRequestPage - 1) * requestRowsPerPage, safeRequestPage * requestRowsPerPage);
  const paginatedDocuments = filteredDocuments.slice((safeDocumentPage - 1) * documentRowsPerPage, safeDocumentPage * documentRowsPerPage);

  const summary = useMemo(() => {
    const sourceRequests = requests.filter((request) => request.source === activeSource);
    const sourceDocs = documents.filter((document) => document.source === activeSource);
    return {
      pending: sourceRequests.filter((request) => request.status === "Pending").length,
      processing: sourceRequests.filter((request) => request.status === "Processing").length,
      approved: sourceRequests.filter((request) => request.status === "Approved").length,
      rejected: sourceRequests.filter((request) => request.status === "Rejected").length,
      generated: sourceDocs.filter((document) => document.status === "Generated").length,
      released: sourceDocs.filter((document) => document.status === "Released").length,
      archived: sourceDocs.filter((document) => document.status === "Archived").length,
      recentGenerated: sourceDocs.filter((document) => snapshotTime - new Date(document.generatedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length,
    };
  }, [activeSource, documents, requests, snapshotTime]);

  const sourceCounts = useMemo(
    () =>
      SOURCES.map((source) => ({
        source,
        requests: requests.filter((request) => request.source === source).length,
      })),
    [requests]
  );

  const entityDocumentHistory = useMemo(() => {
    const history = new Map<string, GeneratedDocument[]>();
    documents.forEach((document) => {
      const key = entityKey(document.source, document.entityId);
      const rows = history.get(key) ?? [];
      rows.push(document);
      history.set(key, rows);
    });
    return history;
  }, [documents]);

  const generatedByRequestId = useMemo(() => {
    const map = new Map<string, GeneratedDocument>();
    documents.forEach((document) => map.set(document.requestId, document));
    return map;
  }, [documents]);

  function resolveEntity(source: DocumentSource, id: string) {
    return entityMap.get(entityKey(source, id));
  }

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
    setRequests((previous) => previous.map((item) => (item.id === id ? { ...item, assignedTo: staff || undefined } : item)));
    addActivity({
      actor: currentActor,
      action: "Assigned",
      entityType: "request",
      entityId: id,
      message: `Assigned ${id} to ${staff || "Unassigned"}.`,
    });
  }

  function generateFromRequest(requestId: string) {
    if (!permissions.generateDocuments) return;
    const request = requests.find((item) => item.id === requestId);
    if (!request || request.status === "Rejected") return;
    const now = new Date().toISOString();
    const code = createDocumentCode(documents);
    const generatedId = `DOC-ROW-${Date.now()}`;
    const next: GeneratedDocument = {
      id: generatedId,
      code,
      requestId: request.id,
      source: request.source,
      entityId: request.entityId,
      documentType: request.documentType,
      purpose: request.purpose,
      generatedBy: currentActor,
      generatedAt: now,
      validUntil: getValidityDate(request.documentType, now),
      status: "Generated",
    };

    setDocuments((previous) => [next, ...previous]);
    setRequests((previous) =>
      previous.map((item) =>
        item.id === request.id
          ? { ...item, status: "Approved", assignedTo: item.assignedTo || currentActor, generatedDocumentId: generatedId }
          : item
      )
    );
    addActivity({
      actor: currentActor,
      action: "Generated",
      entityType: "document",
      entityId: code,
      message: `Generated ${request.documentType} (${code}) from ${request.id}.`,
    });
  }

  function updateGeneratedStatus(id: string, status: GeneratedStatus) {
    if (status === "Archived" && !permissions.archiveDocuments) return;
    const target = documents.find((item) => item.id === id);
    if (!target) return;
    setDocuments((previous) => previous.map((item) => (item.id === id ? { ...item, status } : item)));
    addActivity({
      actor: currentActor,
      action: status,
      entityType: "document",
      entityId: target.code,
      message: `Set ${target.code} to ${status}.`,
    });
  }

  function regenerateDocument(sourceDocument: GeneratedDocument) {
    if (!permissions.generateDocuments) return;
    updateGeneratedStatus(sourceDocument.id, "Archived");
    const now = new Date().toISOString();
    const code = createDocumentCode(documents);
    const regenerated: GeneratedDocument = {
      ...sourceDocument,
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
      message: `Regenerated ${sourceDocument.code} into ${code}.`,
    });
  }

  function downloadDocument(document: GeneratedDocument) {
    const entity = resolveEntity(document.source, document.entityId);
    downloadMockPdf(`${document.code}.pdf`, [
      "Barangay Management System",
      "Generated Certificate",
      `Document Code: ${document.code}`,
      `Source: ${document.source}`,
      `Entity: ${entity?.displayName ?? document.entityId}`,
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
      message: `Downloaded ${document.code}.`,
    });
  }

  function printDocument(document: GeneratedDocument) {
    const entity = resolveEntity(document.source, document.entityId);
    const printWindow = window.open("", "_blank", "width=900,height=720");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>${document.code}</title></head>
        <body style="font-family:Arial;padding:24px;color:#111">
          <h2>Barangay Management System</h2>
          <h3>${document.documentType}</h3>
          <p><strong>Document Code:</strong> ${document.code}</p>
          <p><strong>Source:</strong> ${document.source}</p>
          <p><strong>Entity:</strong> ${entity?.displayName ?? document.entityId}</p>
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

  function bulkApprove() {
    if (!permissions.bulkActions || selectedRequestIds.size === 0) return;
    selectedRequestIds.forEach((id) => updateRequestStatus(id, "Approved"));
  }

  function bulkReject() {
    if (!permissions.bulkActions || selectedRequestIds.size === 0) return;
    selectedRequestIds.forEach((id) => updateRequestStatus(id, "Rejected", "Bulk review rejected"));
  }

  function bulkProcess() {
    if (!permissions.bulkActions || selectedRequestIds.size === 0) return;
    selectedRequestIds.forEach((id) => updateRequestStatus(id, "Processing"));
  }

  function bulkAssign() {
    if (!permissions.bulkActions || selectedRequestIds.size === 0 || !bulkAssignTo) return;
    selectedRequestIds.forEach((id) => assignRequest(id, bulkAssignTo));
  }

  function exportSelectedDocs() {
    const selected = documents.filter((document) => selectedDocumentIds.has(document.id));
    if (selected.length === 0) return;
    exportCsv(`documents-export-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Document Code", "Source", "Entity", "Type", "Purpose", "Generated By", "Generated Date", "Status"],
      ...selected.map((document) => [
        document.code,
        document.source,
        resolveEntity(document.source, document.entityId)?.displayName ?? document.entityId,
        document.documentType,
        document.purpose,
        document.generatedBy,
        formatDateTime(document.generatedAt),
        document.status,
      ]),
    ]);
  }

  function bulkArchive() {
    if (!permissions.archiveDocuments || selectedDocumentIds.size === 0) return;
    setDocuments((previous) =>
      previous.map((document) => (selectedDocumentIds.has(document.id) ? { ...document, status: "Archived" } : document))
    );
    setSelectedDocumentIds(new Set());
  }

  function workflowIndex(request: DocumentRequest, generated?: GeneratedDocument) {
    if (request.status === "Rejected") return 0;
    if (generated?.status === "Released") return 4;
    if (generated?.status === "Generated" || generated?.status === "Archived") return 3;
    if (request.status === "Approved") return 2;
    if (request.status === "Processing") return 1;
    return 0;
  }

  function simulateNewRequest() {
    if (!permissions.processRequests) return;
    const candidates = ENTITY_SEED.filter((entity) => entity.source === activeSource);
    const entity = candidates[Math.floor(Math.random() * candidates.length)];
    if (!entity) return;
    const type = DOCUMENT_TYPES[Math.floor(Math.random() * DOCUMENT_TYPES.length)];
    const next: DocumentRequest = {
      id: createRequestId(requests),
      source: activeSource,
      entityId: entity.id,
      documentType: type,
      purpose: "Walk-in front desk request",
      requestedAt: new Date().toISOString(),
      status: "Pending",
    };
    setRequests((previous) => [next, ...previous]);
    addActivity({
      actor: currentActor,
      action: "Created",
      entityType: "request",
      entityId: next.id,
      message: `Created ${next.id} under ${activeSource}.`,
    });
  }

  function requestTypeCounts() {
    return DOCUMENT_TYPES.map((type) => ({
      type,
      count: requests.filter((request) => request.source === activeSource && request.documentType === type).length,
    }));
  }

  function staffOutput() {
    return STAFF_MEMBERS.map((staff) => ({
      staff,
      generated: documents.filter((document) => document.source === activeSource && document.generatedBy === staff).length,
      assigned: requests.filter((request) => request.source === activeSource && request.assignedTo === staff).length,
    }));
  }

  const pendingAlerts = summary.pending + summary.processing;
  const rejectedAlerts = summary.rejected;

  return (
    <section className="space-y-6">
      <header className="space-y-5 px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Documents & Certificates</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Manage document requests, processing, and generated certificates for residents and other entities.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const csvData = [
                  ["Document Code", "Type", "Status", "Date"],
                  ...documents.filter(d => d.source === activeSource).map(d => [d.code, d.documentType, d.status, d.generatedAt])
                ];
                exportCsv(`report-${activeSource.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`, csvData);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] shadow-sm"
            >
              <FileDown className="h-4 w-4 text-[var(--primary)]" />
              Export Report
            </button>
            <button
              type="button"
              onClick={simulateNewRequest}
              disabled={!permissions.processRequests}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <SummaryCard icon={ClipboardList} label="Pending Requests" value={summary.pending} tone="blue" viewAllText="View all pending" />
          <SummaryCard icon={Clock3} label="Processing" value={summary.processing} tone="amber" viewAllText="View all processing" />
          <SummaryCard icon={CheckCircle2} label="Approved" value={summary.approved} tone="emerald" viewAllText="View all approved" />
          <SummaryCard icon={FileText} label="Generated This Week" value={summary.recentGenerated} tone="purple" viewAllText="View all generated" />
          <SummaryCard icon={XCircle} label="Rejected" value={summary.rejected} tone="rose" viewAllText="View all rejected" />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Source Workspace</p>
            <span className="text-xs text-[var(--muted)]">Choose dataset</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {SOURCES.map((source) => {
              const count = sourceCounts.find((row) => row.source === source)?.requests ?? 0;
              return (
                <button
                  key={source}
                  type="button"
                  onClick={() => {
                    setActiveSource(source);
                    setRequestPage(1);
                    setDocumentPage(1);
                    setSelectedRequestIds(new Set());
                    setSelectedDocumentIds(new Set());
                  }}
                  className={cn(
                    "inline-flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold uppercase tracking-[0.11em] transition-all",
                    activeSource === source
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(var(--primary-rgb),0.2)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:bg-[var(--card-soft)] hover:text-[var(--text)]"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {source === "Residents" ? <UserRound className="h-4 w-4" /> : null}
                    {source === "Establishments" ? <Building2 className="h-4 w-4" /> : null}
                    {source === "Lots / Buildings" ? <Layers3 className="h-4 w-4" /> : null}
                    {source === "Case Records / VAWC" ? <ShieldAlert className="h-4 w-4" /> : null}
                    {source}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px]", activeSource === source ? "bg-white/20" : "bg-[var(--card-soft)]")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Workflow Visibility</p>
            <span className="text-xs text-[var(--muted)]">{activeSource}</span>
          </div>
          <div className="grid gap-2 md:grid-cols-5">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Step {index + 1}</p>
                <p className="mt-0.5 text-xs font-semibold text-[var(--text)]">{step}</p>
              </div>
            ))}
          </div>
          {(pendingAlerts > 0 || rejectedAlerts > 0) ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {pendingAlerts > 0 ? <AlertPill tone="amber" text={`${pendingAlerts} requests need processing`} /> : null}
              {rejectedAlerts > 0 ? <AlertPill tone="rose" text={`${rejectedAlerts} rejected requests need review`} /> : null}
            </div>
          ) : null}
        </div>

        <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm">
          {VIEW_TABS.map((tab) => (
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
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="border-b border-[var(--border)] p-4">
            <div className="grid gap-3 md:grid-cols-[1.7fr_auto_auto]">
              <label>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search Requests</span>
                <div className="relative mt-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={requestSearch}
                    onChange={(event) => {
                      setRequestSearch(event.target.value);
                      setRequestPage(1);
                    }}
                    placeholder="Request ID, entity, type, assignee"
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] shadow-sm outline-none focus:border-[var(--primary)]/40"
                  />
                </div>
              </label>
              <SortButton
                label={`Sort: ${requestSortBy}`}
                onClick={() => setRequestSortBy((prev) => (prev === "date" ? "name" : prev === "name" ? "type" : "date"))}
              />
              <button
                type="button"
                onClick={() => setShowRequestFilters((prev) => !prev)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-xs font-semibold text-[var(--text)] shadow-sm"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={cn("h-4 w-4 transition-transform", showRequestFilters ? "rotate-180" : "")} />
              </button>
            </div>

            {showRequestFilters ? (
              <div className="mt-3 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/55 p-3 md:grid-cols-4">
                <FilterSelect label="Status" value={requestStatusFilter} options={REQUEST_STATUS_OPTIONS} onChange={(value) => setRequestStatusFilter(value as "All" | RequestStatus)} />
                <FilterSelect label="Type" value={requestTypeFilter} options={["All", ...DOCUMENT_TYPES]} onChange={(value) => setRequestTypeFilter(value as "All" | DocumentType)} />
                <DateFilter label="From" value={requestFrom} onChange={setRequestFrom} />
                <DateFilter label="To" value={requestTo} onChange={setRequestTo} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)]">
            <span>Showing {filteredRequests.length} requests - page {safeRequestPage} of {requestPages}</span>
            <div className="flex items-center gap-2">
              <SortButton
                label={requestSortDirection === "asc" ? "Ascending" : "Descending"}
                onClick={() => setRequestSortDirection((value) => (value === "asc" ? "desc" : "asc"))}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/70 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/35">
                {paginatedRequests.map((request) => {
                  const entity = resolveEntity(request.source, request.entityId);
                  const generated = generatedByRequestId.get(request.id);
                  const progress = workflowIndex(request, generated);
                  const canGenerate = permissions.generateDocuments && request.status !== "Rejected" && request.status !== "Pending";
                  return (
                    <tr key={request.id} className="align-top transition-colors hover:bg-[var(--card-soft)]/45">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRequestIds.has(request.id)}
                          onChange={(event) =>
                            setSelectedRequestIds((prev) => {
                              const next = new Set(prev);
                              if (event.target.checked) next.add(request.id);
                              else next.delete(request.id);
                              return next;
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--text)]">{request.id}</p>
                        <p className="text-xs text-[var(--muted)]">{request.documentType}</p>
                        <p className="text-xs text-[var(--muted)]">{formatDateTime(request.requestedAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("mb-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold", sourceTone(request.source))}>{request.source}</span>
                        <Link href={entity?.href ?? "/reports"} className="block font-semibold text-[var(--primary)]">
                          {entity?.displayName ?? request.entityId}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">{entity?.subtitle ?? "No additional metadata"}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{request.purpose}</td>
                      <td className="px-4 py-3">
                        <select
                          value={request.assignedTo ?? ""}
                          onChange={(event) => assignRequest(request.id, event.target.value)}
                          disabled={role === "Viewer"}
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
                        <WorkflowMini index={progress} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", requestStatusTone(request.status))}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <ActionButton icon={Eye} label="View" onClick={() => setViewRequest(request)} />
                          <ActionButton icon={Clock3} label="Process" disabled={role === "Viewer" || !permissions.processRequests || request.status !== "Pending"} onClick={() => updateRequestStatus(request.id, "Processing")} />
                          <ActionButton icon={CheckCircle2} label="Approve" disabled={role === "Viewer" || !permissions.approveReject || request.status === "Approved" || request.status === "Rejected"} onClick={() => updateRequestStatus(request.id, "Approved")} />
                          <ActionButton icon={XCircle} label="Reject" disabled={role === "Viewer" || !permissions.approveReject || request.status === "Rejected"} onClick={() => updateRequestStatus(request.id, "Rejected", "Rejected by review")} />
                          <ActionButton icon={FileText} label="Generate" disabled={!canGenerate} onClick={() => generateFromRequest(request.id)} />
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
              <button type="button" onClick={() => setSelectedRequestIds(new Set(paginatedRequests.map((row) => row.id)))} disabled={!permissions.bulkActions} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] disabled:opacity-40">
                Select Page
              </button>
              <button type="button" onClick={bulkProcess} disabled={!permissions.bulkActions || selectedRequestIds.size === 0} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] disabled:opacity-40">
                Bulk Process
              </button>
              <button type="button" onClick={bulkApprove} disabled={!permissions.bulkActions || selectedRequestIds.size === 0} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] disabled:opacity-40">
                Bulk Approve
              </button>
              <button type="button" onClick={bulkReject} disabled={!permissions.bulkActions || selectedRequestIds.size === 0} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] disabled:opacity-40">
                Bulk Reject
              </button>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1.5">
                <select value={bulkAssignTo} onChange={(event) => setBulkAssignTo(event.target.value)} className="bg-transparent text-xs text-[var(--text)] outline-none">
                  <option value="">Assign staff...</option>
                  {STAFF_MEMBERS.map((staff) => (
                    <option key={staff} value={staff}>
                      {staff}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={bulkAssign} disabled={!permissions.bulkActions || selectedRequestIds.size === 0 || !bulkAssignTo} className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold disabled:opacity-40">
                  Bulk Assign
                </button>
              </div>
            </div>
            <Pagination page={safeRequestPage} pages={requestPages} onPrevious={() => setRequestPage((value) => Math.max(1, value - 1))} onNext={() => setRequestPage((value) => Math.min(requestPages, value + 1))} />
          </div>
        </section>
      ) : null}

      {activeTab === "Generated Documents" ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="border-b border-[var(--border)] p-4">
            <div className="grid gap-3 md:grid-cols-[1.7fr_auto_auto]">
              <label>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search Generated</span>
                <div className="relative mt-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={documentSearch}
                    onChange={(event) => {
                      setDocumentSearch(event.target.value);
                      setDocumentPage(1);
                    }}
                    placeholder="Document code, entity, generated by"
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] shadow-sm outline-none focus:border-[var(--primary)]/40"
                  />
                </div>
              </label>
              <SortButton
                label={`Sort: ${documentSortBy}`}
                onClick={() => setDocumentSortBy((prev) => (prev === "date" ? "name" : prev === "name" ? "type" : "date"))}
              />
              <button type="button" onClick={() => setShowDocumentFilters((prev) => !prev)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-xs font-semibold text-[var(--text)] shadow-sm">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={cn("h-4 w-4 transition-transform", showDocumentFilters ? "rotate-180" : "")} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
              <span>Showing {filteredDocuments.length} generated documents - page {safeDocumentPage} of {documentPages}</span>
              <SortButton
                label={documentSortDirection === "asc" ? "Ascending" : "Descending"}
                onClick={() => setDocumentSortDirection((value) => (value === "asc" ? "desc" : "asc"))}
              />
            </div>
            {showDocumentFilters ? (
              <div className="mt-3 grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/55 p-3 md:grid-cols-4">
                <FilterSelect label="Status" value={documentStatusFilter} options={GENERATED_STATUS_OPTIONS} onChange={(value) => setDocumentStatusFilter(value as "All" | GeneratedStatus)} />
                <FilterSelect label="Type" value={documentTypeFilter} options={["All", ...DOCUMENT_TYPES]} onChange={(value) => setDocumentTypeFilter(value as "All" | DocumentType)} />
                <DateFilter label="From" value={documentFrom} onChange={setDocumentFrom} />
                <DateFilter label="To" value={documentTo} onChange={setDocumentTo} />
              </div>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/70 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Generated By</th>
                  <th className="px-4 py-3">Generated</th>
                  <th className="px-4 py-3">Validity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/35">
                {paginatedDocuments.map((document) => {
                  const entity = resolveEntity(document.source, document.entityId);
                  return (
                    <tr key={document.id} className="transition-colors hover:bg-[var(--card-soft)]/45">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDocumentIds.has(document.id)}
                          onChange={(event) =>
                            setSelectedDocumentIds((prev) => {
                              const next = new Set(prev);
                              if (event.target.checked) next.add(document.id);
                              else next.delete(document.id);
                              return next;
                            })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[var(--text)]">{document.code}</p>
                        <p className="text-xs text-[var(--muted)]">{document.documentType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("mb-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold", sourceTone(document.source))}>{document.source}</span>
                        <Link href={entity?.href ?? "/reports"} className="block font-semibold text-[var(--primary)]">
                          {entity?.displayName ?? document.entityId}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">{entity?.subtitle ?? "No additional metadata"}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{document.purpose}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{document.generatedBy}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{formatDateTime(document.generatedAt)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{document.validUntil ? formatDate(document.validUntil) : "No expiry"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", documentStatusTone(document.status))}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <ActionButton icon={Eye} label="View" onClick={() => setViewDocument(document)} />
                          <ActionButton icon={Download} label="PDF" onClick={() => downloadDocument(document)} />
                          <ActionButton icon={Printer} label="Print" onClick={() => printDocument(document)} />
                          <ActionButton icon={RefreshCcw} label="Re-gen" disabled={!permissions.generateDocuments} onClick={() => regenerateDocument(document)} />
                          <ActionButton icon={CheckCircle2} label="Release" disabled={document.status === "Released"} onClick={() => updateGeneratedStatus(document.id, "Released")} />
                          <ActionButton icon={Archive} label="Archive" disabled={!permissions.archiveDocuments} onClick={() => updateGeneratedStatus(document.id, "Archived")} />
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
              <button type="button" onClick={exportSelectedDocs} disabled={!permissions.bulkActions || selectedDocumentIds.size === 0} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
                Export Selected
              </button>
              <button type="button" onClick={bulkArchive} disabled={!permissions.archiveDocuments || selectedDocumentIds.size === 0} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
                Archive Selected
              </button>
              <button type="button" onClick={() => setSelectedDocumentIds(new Set())} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold">
                Clear Selection
              </button>
            </div>
            <Pagination page={safeDocumentPage} pages={documentPages} onPrevious={() => setDocumentPage((value) => Math.max(1, value - 1))} onNext={() => setDocumentPage((value) => Math.min(documentPages, value + 1))} />
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
                    <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.max(6, (row.count / Math.max(1, filteredRequests.length || 1)) * 100)}%` }} />
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

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Recent Activity</h2>
          <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Audit Log</span>
        </div>
        <div className="mt-4 max-h-72 space-y-2 overflow-auto">
          {activities.filter((activity) => {
            if (activity.entityType === "request") {
              return requests.some((request) => request.id === activity.entityId && request.source === activeSource);
            }
            return documents.some((document) => document.code === activity.entityId && document.source === activeSource);
          }).slice(0, 12).map((activity) => (
            <div key={activity.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 shadow-sm">
              <p className="text-sm text-[var(--text)]">{activity.message}</p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">{activity.actor} | {formatDateTime(activity.createdAt)}</p>
            </div>
          ))}
        </div>
      </section>

      {viewRequest ? (
        <Modal title={`Request Details | ${viewRequest.id}`} onClose={() => setViewRequest(null)}>
          <DetailGrid
            items={[
              { label: "Request ID", value: viewRequest.id },
              { label: "Source", value: viewRequest.source },
              { label: "Entity", value: resolveEntity(viewRequest.source, viewRequest.entityId)?.displayName ?? viewRequest.entityId },
              { label: "Document Type", value: viewRequest.documentType },
              { label: "Purpose", value: viewRequest.purpose },
              { label: "Date Requested", value: formatDateTime(viewRequest.requestedAt) },
              { label: "Assigned To", value: viewRequest.assignedTo || "Unassigned" },
              { label: "Status", value: viewRequest.status },
              { label: "Remarks", value: viewRequest.remarks || "None" },
            ]}
          />
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Status Timeline</h3>
            <RequestTimeline request={viewRequest} generated={generatedByRequestId.get(viewRequest.id)} />
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Entity Document History</h3>
            <div className="mt-2 space-y-2">
              {(entityDocumentHistory.get(entityKey(viewRequest.source, viewRequest.entityId)) ?? []).map((document) => (
                <div key={document.id} className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)]">
                  {document.code} | {document.documentType} | {formatDate(document.generatedAt)}
                </div>
              ))}
              {(entityDocumentHistory.get(entityKey(viewRequest.source, viewRequest.entityId)) ?? []).length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No previous documents for this entity.</p>
              ) : null}
            </div>
          </div>
        </Modal>
      ) : null}

      {viewDocument ? (
        <Modal title={`Generated Document | ${viewDocument.code}`} onClose={() => setViewDocument(null)}>
          <DetailGrid
            items={[
              { label: "Document Code", value: viewDocument.code },
              { label: "Request ID", value: viewDocument.requestId },
              { label: "Source", value: viewDocument.source },
              { label: "Entity", value: resolveEntity(viewDocument.source, viewDocument.entityId)?.displayName ?? viewDocument.entityId },
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
  viewAllText,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "amber" | "blue" | "emerald" | "rose" | "cyan" | "purple";
  viewAllText?: string;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/5 text-amber-600"
      : tone === "blue"
        ? "border-blue-300/30 bg-blue-500/5 text-blue-600"
        : tone === "rose"
          ? "border-rose-300/30 bg-rose-500/5 text-rose-600"
          : tone === "cyan"
            ? "border-cyan-300/30 bg-cyan-500/5 text-cyan-600"
            : tone === "purple"
              ? "border-purple-300/30 bg-purple-500/5 text-purple-600"
              : "border-emerald-300/30 bg-emerald-500/5 text-emerald-600";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
        <div className={cn("rounded-lg border p-2", toneClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{value}</p>
        {viewAllText ? (
          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--primary)] cursor-pointer">
            {viewAllText}
            <ChevronRight className="h-3 w-3" />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function AlertPill({ tone, text }: { tone: "amber" | "rose"; text: string }) {
  const style =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : "border-rose-300/30 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  return <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", style)}>{text}</span>;
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
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] shadow-sm outline-none focus:border-[var(--primary)]/40">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] shadow-sm outline-none focus:border-[var(--primary)]/40" />
    </label>
  );
}

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-10 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] shadow-sm hover:border-[var(--primary)]/40">
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
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[11px] font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--primary)]/40 hover:bg-[var(--card-soft)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function WorkflowMini({ index }: { index: number }) {
  return (
    <div className="w-36 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-2 shadow-sm">
      <div className="mb-1 flex justify-between text-[9px] text-[var(--muted)]">
        <span>{WORKFLOW_STEPS[index]}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {WORKFLOW_STEPS.map((step, stepIndex) => (
          <div key={step} className={cn("h-1.5 rounded-full", stepIndex <= index ? "bg-[var(--primary)]" : "bg-[var(--card-soft)]")} />
        ))}
      </div>
    </div>
  );
}

function RequestTimeline({ request, generated }: { request: DocumentRequest; generated?: GeneratedDocument }) {
  const stage =
    generated?.status === "Released"
      ? 4
      : generated
        ? 3
        : request.status === "Approved"
          ? 2
          : request.status === "Processing"
            ? 1
            : 0;

  return (
    <div className="mt-2 space-y-2">
      {WORKFLOW_STEPS.map((label, index) => (
        <div key={label} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm">
          <span className={cn("inline-flex h-2.5 w-2.5 rounded-full", index <= stage ? "bg-[var(--primary)]" : "bg-[var(--border)]")} />
          <span className={cn("font-medium", index <= stage ? "text-[var(--text)]" : "text-[var(--muted)]")}>{label}</span>
        </div>
      ))}
    </div>
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
      <button type="button" onClick={onPrevious} disabled={page === 1} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-semibold text-[var(--text)] shadow-sm disabled:opacity-40">
        Previous
      </button>
      <span className="text-[var(--muted)]">Page {page} of {pages}</span>
      <button type="button" onClick={onNext} disabled={page === pages} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-semibold text-[var(--text)] shadow-sm disabled:opacity-40">
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{item.label}</p>
          <p className="mt-1 text-sm text-[var(--text)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
