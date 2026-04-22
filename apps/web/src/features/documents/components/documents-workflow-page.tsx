"use client";

import Link from "next/link";
import React, { useMemo, useState, Fragment } from "react";
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
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
  UserRound,
  Calendar,
  X,
  XCircle,
} from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
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
  { id: "RES-2026-0007", source: "Residents", displayName: "Pedro Cruz Luna", subtitle: "Purok 1", href: "/residents?search=RES-2026-0007" },
  { id: "RES-2026-0008", source: "Residents", displayName: "Mark Lim Aquino", subtitle: "Purok 2", href: "/residents?search=RES-2026-0008" },
  { id: "EST-2026-0001", source: "Establishments", displayName: "Salaza Mart", subtitle: "Retail | Purok 1", href: "/establishments?search=EST-2026-0001" },
  { id: "EST-2026-0002", source: "Establishments", displayName: "Kusina ni Liza", subtitle: "Food & Beverage | Purok 2", href: "/establishments?search=EST-2026-0002" },
  { id: "LOT-2026-0001", source: "Lots / Buildings", displayName: "Lot 12 Block 4", subtitle: "Purok 3 | Tax Dec 2026-3321", href: "/reports" },
  { id: "CASE-2026-0009", source: "Case Records / VAWC", displayName: "Case Referral 2026-0009", subtitle: "VAWC | Confidential Record", href: "/reports" },
];

function generateRequestSeed(): DocumentRequest[] {
  const requests: DocumentRequest[] = [];
  const resEntities = ENTITY_SEED.filter(e => e.source === "Residents");
  
  // 18 Pending
  for (let i = 1; i <= 18; i++) {
    requests.push({
      id: `REQ-2026-${10000 + i}`,
      source: "Residents",
      entityId: resEntities[i % resEntities.length].id,
      documentType: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length],
      purpose: "General requirement",
      requestedAt: new Date(Date.now() - i * 3600000).toISOString(),
      status: "Pending",
    });
  }
  // 7 Processing
  for (let i = 1; i <= 7; i++) {
    requests.push({
      id: `REQ-2026-${20000 + i}`,
      source: "Residents",
      entityId: resEntities[i % resEntities.length].id,
      documentType: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length],
      purpose: "Processing request",
      requestedAt: new Date(Date.now() - i * 7200000).toISOString(),
      status: "Processing",
      assignedTo: STAFF_MEMBERS[i % STAFF_MEMBERS.length],
    });
  }
  // 42 Approved
  for (let i = 1; i <= 42; i++) {
    requests.push({
      id: `REQ-2026-${30000 + i}`,
      source: "Residents",
      entityId: resEntities[i % resEntities.length].id,
      documentType: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length],
      purpose: "Approved requirement",
      requestedAt: new Date(Date.now() - i * 86400000).toISOString(),
      status: "Approved",
      assignedTo: STAFF_MEMBERS[i % STAFF_MEMBERS.length],
    });
  }
  // 6 Rejected
  for (let i = 1; i <= 6; i++) {
    requests.push({
      id: `REQ-2026-${40000 + i}`,
      source: "Residents",
      entityId: resEntities[i % resEntities.length].id,
      documentType: DOCUMENT_TYPES[i % DOCUMENT_TYPES.length],
      purpose: "Incomplete details",
      requestedAt: new Date(Date.now() - i * 172800000).toISOString(),
      status: "Rejected",
      remarks: "Missing supporting documents",
    });
  }
  return requests;
}

function generateDocumentSeed(reqs: DocumentRequest[]): GeneratedDocument[] {
  const documents: GeneratedDocument[] = [];
  const approvedReqs = reqs.filter(r => r.status === "Approved");
  
  // 35 Generated (recent)
  for (let i = 0; i < 35; i++) {
    const r = approvedReqs[i % approvedReqs.length];
    documents.push({
      id: `DOC-ROW-${i}`,
      code: `DOC-2026-${50000 + i}`,
      requestId: r.id,
      source: r.source,
      entityId: r.entityId,
      documentType: r.documentType,
      purpose: r.purpose,
      generatedBy: r.assignedTo || STAFF_MEMBERS[0],
      generatedAt: new Date(Date.now() - i * 1800000).toISOString(),
      validUntil: new Date(Date.now() + 180 * 86400000).toISOString(),
      status: "Generated",
    });
  }
  return documents;
}

const REQUEST_SEED = generateRequestSeed();
const DOCUMENT_SEED = generateDocumentSeed(REQUEST_SEED);

const ACTIVITY_SEED: ActivityLog[] = [
  {
    id: "ACT-000001",
    actor: "Aira Flores",
    action: "Generated",
    entityType: "document",
    entityId: "DOC-2026-50000",
    message: "Generated Certificate of Residency for Ana Garcia Reyes.",
    createdAt: "2026-04-18T22:12:00.000Z",
  },
  {
    id: "ACT-000002",
    actor: "Rico Santos",
    action: "Processing",
    entityType: "request",
    entityId: "REQ-2026-10002",
    message: "Moved request REQ-2026-10002 to Processing.",
    createdAt: "2026-04-19T11:35:00.000Z",
  },
  {
    id: "ACT-000003",
    actor: "Aira Flores",
    action: "Approved",
    entityType: "request",
    entityId: "REQ-2026-10003",
    message: "Approved request REQ-2026-10003.",
    createdAt: "2026-04-18T10:05:00.000Z",
  },
  {
    id: "ACT-000004",
    actor: "Pauline Seitz",
    action: "Generated",
    entityType: "document",
    entityId: "DOC-2026-50001",
    message: "Generated Barangay Clearance for Juan Reyes Dela Cruz.",
    createdAt: "2026-04-17T15:20:00.000Z",
  },
];

export function DocumentsWorkflowPage() {
  const [snapshotTime] = useState(() => Date.now());
  const [role, setRole] = useState<UserRole>("Admin");
  const [activeSource, setActiveSource] = useState<DocumentSource>("Residents");
  const [activeTab, setActiveTab] = useState<(typeof VIEW_TABS)[number]>("Requests");
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

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

  const requestRowsPerPage = 8;
  const documentRowsPerPage = 8;

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

  const requestPages = Math.max(1, Math.ceil(filteredRequests.length / requestRowsPerPage));
  const documentPages = Math.max(1, Math.ceil(filteredDocuments.length / documentRowsPerPage));
  const safeRequestPage = Math.min(requestPage, requestPages);
  const safeDocumentPage = Math.min(documentPage, documentPages);
  const paginatedRequests = filteredRequests.slice((safeRequestPage - 1) * requestRowsPerPage, safeRequestPage * requestRowsPerPage);
  const paginatedDocuments = filteredDocuments.slice((safeDocumentPage - 1) * documentRowsPerPage, safeDocumentPage * documentRowsPerPage);

  const allVisibleRequestsSelected =
    paginatedRequests.length > 0 && paginatedRequests.every((r) => selectedRequestIds.has(r.id));

  const allVisibleDocumentsSelected =
    paginatedDocuments.length > 0 && paginatedDocuments.every((d) => selectedDocumentIds.has(d.id));

  function toggleSelectRequest(id: string) {
    setSelectedRequestIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectVisibleRequests() {
    setSelectedRequestIds((prev) => {
      const next = new Set(prev);
      if (allVisibleRequestsSelected) {
        paginatedRequests.forEach((r) => next.delete(r.id));
      } else {
        paginatedRequests.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }

  function toggleSelectDocument(id: string) {
    setSelectedDocumentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectVisibleDocuments() {
    setSelectedDocumentIds((prev) => {
      const next = new Set(prev);
      if (allVisibleDocumentsSelected) {
        paginatedDocuments.forEach((d) => next.delete(d.id));
      } else {
        paginatedDocuments.forEach((d) => next.add(d.id));
      }
      return next;
    });
  }

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
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Documents & Certificates</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Manage document requests, processing, and generated certificates for residents and other entities.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const csvData = [
                  ["Document Code", "Type", "Status", "Date"],
                  ...documents.filter(d => d.source === activeSource).map(d => [d.code, d.documentType, d.status, d.generatedAt])
                ];
                exportCsv(`report-${activeSource.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`, csvData);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] hover:border-[var(--primary)]/40"
            >
              <Download className="h-4 w-4 text-[var(--primary)]" />
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <SummaryCard icon={ClipboardList} label="Pending Requests" value={summary.pending} tone="blue" viewAllText="View all pending" />
          <SummaryCard icon={Clock3} label="Processing" value={summary.processing} tone="amber" viewAllText="View all processing" />
          <SummaryCard icon={CheckCircle2} label="Approved" value={summary.approved} tone="emerald" viewAllText="View all approved" />
          <SummaryCard icon={FileText} label="Generated This Week" value={summary.recentGenerated} tone="purple" viewAllText="View all generated" />
          <SummaryCard icon={XCircle} label="Rejected" value={summary.rejected} tone="rose" viewAllText="View all rejected" />
        </div>

        <div className="mt-8 flex items-center gap-1.5 rounded-2xl bg-[var(--card-soft)]/50 p-2 border border-[var(--border)]/50">
          {SOURCES.map((source) => {
            const count = sourceCounts.find((row) => row.source === source)?.requests ?? 0;
            const isActive = activeSource === source;
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
                  setExpandedRequestId(null);
                }}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-3 rounded-xl px-6 py-3 text-[13px] font-bold tracking-tight transition-all duration-300",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--muted)] hover:bg-[var(--card)]/80 hover:text-[var(--text)]"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                  isActive ? "bg-white/20 scale-110" : "bg-[var(--card-soft)] group-hover:bg-[var(--card)]"
                )}>
                  {source === "Residents" ? <UserRound className="h-4 w-4" /> : null}
                  {source === "Establishments" ? <Building2 className="h-4 w-4" /> : null}
                  {source === "Lots / Buildings" ? <Layers3 className="h-4 w-4" /> : null}
                  {source === "Case Records / VAWC" ? <ShieldAlert className="h-4 w-4" /> : null}
                </div>
                {source}
                <span className={cn(
                  "ml-1 flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-[10px] font-black tracking-tighter transition-all duration-300",
                  isActive 
                    ? "bg-white text-[var(--primary)] shadow-sm" 
                    : "bg-[var(--border)] text-[var(--muted)] group-hover:bg-[var(--primary)]/20"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>


        <div className="mt-8">
          <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--card-soft)]/50 p-2 border border-[var(--border)]/50">
            {VIEW_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 rounded-xl px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]/40"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="relative px-1">
        <div className="w-full">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all">
            <div className="border-b border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-end">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">Search Records</span>
                    <div className="relative group">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
                      <input
                        type="text"
                        placeholder="ID, Name, Type, Purpose..."
                        value={activeTab === "Requests" ? requestSearch : documentSearch}
                        onChange={(e) => (activeTab === "Requests" ? setRequestSearch(e.target.value) : setDocumentSearch(e.target.value))}
                        className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] pl-10 pr-4 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] transition-all"
                      />
                    </div>
                  </label>

                  <FilterSelect 
                    label="Status" 
                    value={activeTab === "Requests" ? requestStatusFilter : documentStatusFilter} 
                    options={activeTab === "Requests" ? REQUEST_STATUS_OPTIONS : GENERATED_STATUS_OPTIONS} 
                    onChange={(v) => activeTab === "Requests" ? setRequestStatusFilter(v as any) : setDocumentStatusFilter(v as any)} 
                  />
                  
                  <FilterSelect 
                    label="Document Type" 
                    value={activeTab === "Requests" ? requestTypeFilter : documentTypeFilter} 
                    options={["All", ...DOCUMENT_TYPES]} 
                    onChange={(v) => activeTab === "Requests" ? setRequestTypeFilter(v as any) : setDocumentTypeFilter(v as any)} 
                  />

                  <DateFilter label="From Date" value={activeTab === "Requests" ? requestFrom : documentFrom} onChange={(v) => activeTab === "Requests" ? setRequestFrom(v) : setDocumentFrom(v)} />
                  <DateFilter label="To Date" value={activeTab === "Requests" ? requestTo : documentTo} onChange={(v) => activeTab === "Requests" ? setRequestTo(v) : setDocumentTo(v)} />
                  <button 
                    onClick={() => {
                      if (activeTab === "Requests") {
                        setRequestSearch("");
                        setRequestStatusFilter("All");
                        setRequestTypeFilter("All");
                        setRequestFrom("");
                        setRequestTo("");
                      } else {
                        setDocumentSearch("");
                        setDocumentStatusFilter("All");
                        setDocumentTypeFilter("All");
                        setDocumentFrom("");
                        setDocumentTo("");
                      }
                    }}
                    className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] hover:border-[var(--primary)]/30 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "Requests" ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                        <th className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={allVisibleRequestsSelected}
                            onChange={toggleSelectVisibleRequests}
                            className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                            aria-label="Select all visible requests"
                          />
                        </th>
                        <ThButton label="Request ID / Type" active={requestSortBy === "type"} direction={requestSortDirection} onClick={() => { setRequestSortBy("type"); setRequestSortDirection(d => d === "asc" ? "desc" : "asc"); }} />
                        <ThButton label="Resident" active={requestSortBy === "name"} direction={requestSortDirection} onClick={() => { setRequestSortBy("name"); setRequestSortDirection(d => d === "asc" ? "desc" : "asc"); }} />
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Purpose</th>
                        <ThButton label="Requested At" active={requestSortBy === "date"} direction={requestSortDirection} onClick={() => { setRequestSortBy("date"); setRequestSortDirection(d => d === "asc" ? "desc" : "asc"); }} />
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Assigned To</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Status</th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]/40">
                      {paginatedRequests.map((request) => {
                        const entity = resolveEntity(request.source, request.entityId);
                        const isSelected = selectedRequestIds.has(request.id);
                        const isExpanded = expandedRequestId === request.id;
                        
                        return (
                          <React.Fragment key={request.id}>
                            <tr 
                              className={cn(
                                "group relative transition-all hover:bg-[var(--primary)]/[0.02]",
                                isSelected && "bg-[var(--primary)]/[0.04]",
                                isExpanded && "bg-[var(--primary)]/[0.06]"
                              )}
                            >
                              <td className="relative px-4 py-3.5 text-center">
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                                />
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectRequest(request.id)}
                                  className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                                />
                              </td>
                              <td className="px-4 py-3.5 cursor-pointer" onClick={() => setExpandedRequestId(isExpanded ? null : request.id)}>
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">{request.id}</span>
                                  <span className="tracking-tight text-[var(--text)]">{request.documentType}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <Avatar 
                                    src="/avatar.png"
                                    name={entity?.displayName ?? request.entityId} 
                                    hideText 
                                    className="h-9 w-9" 
                                  />
                                  <div className="flex flex-col">
                                    <span className="tracking-tight text-[var(--text)] font-medium">{entity?.displayName ?? request.entityId}</span>
                                    <span className="text-[10px] font-medium text-[var(--muted)]">resident-profile.v1</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <p className="max-w-[160px] truncate text-xs font-medium text-[var(--muted)]" title={request.purpose}>{request.purpose}</p>
                              </td>
                              <td className="px-4 py-3.5">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-[var(--text)] tracking-tight">{formatDate(request.requestedAt)}</span>
                                    <span className="text-[10px] font-medium text-[var(--muted)]">{new Date(request.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                              </td>
                              <td className="px-4 py-3.5">
                                {request.assignedTo ? (
                                  <div className="flex items-center gap-2 rounded-lg bg-[var(--card-soft)]/50 px-2 py-1 border border-[var(--border)]/50 w-fit">
                                    <Avatar name={request.assignedTo} hideText className="scale-75 origin-left" />
                                    <span className="text-[11px] font-medium text-[var(--text)]">{request.assignedTo.split(' ')[0]}</span>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-50">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                    Unassigned
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3.5">
                                <StatusChip status={request.status} tone={requestStatusTone(request.status)} />
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <DropdownMenu
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                                  trigger={<MoreHorizontal className="h-4 w-4" />}
                                  items={[
                                    { label: "View Details", icon: Eye, onClick: () => setExpandedRequestId(isExpanded ? null : request.id) },
                                    { label: "Approve Request", icon: FileCheck2, onClick: () => updateRequestStatus(request.id, "Approved"), disabled: request.status === "Approved" || request.status === "Rejected" },
                                    { label: "Reject Request", icon: XCircle, onClick: () => updateRequestStatus(request.id, "Rejected"), disabled: request.status === "Approved" || request.status === "Rejected" },
                                    { label: "Generate Document", icon: Download, onClick: () => generateFromRequest(request.id), disabled: request.status === "Rejected" },
                                    { type: "separator" },
                                    { label: "Edit Purpose", icon: Pencil },
                                    { label: "Delete Request", icon: Trash2, className: "text-rose-600 hover:bg-rose-50" },
                                  ]}
                                />
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-[var(--primary)]/[0.02]">
                                <td colSpan={9} className="px-6 py-8 border-b border-[var(--border)]">
                                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
                                      <div className="space-y-6">
                                        <div className="flex items-start gap-5">
                                          <Avatar name={entity?.displayName ?? request.entityId} className="h-20 w-20 shrink-0 border-4 border-white shadow-xl ring-1 ring-[var(--border)]" />
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                              <h4 className="text-2xl font-black tracking-tight text-[var(--text)]">{entity?.displayName ?? request.entityId}</h4>
                                              <StatusChip status={request.status} tone={requestStatusTone(request.status)} />
                                            </div>
                                            <p className="mt-1 text-sm text-[var(--muted)] font-bold uppercase tracking-widest">{entity?.subtitle ?? "Resident Profile"}</p>
                                            
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                              <div className="rounded-xl bg-white p-3 border border-[var(--border)] shadow-sm">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Requested Document</p>
                                                <p className="mt-1 font-bold text-[var(--text)]">{request.documentType}</p>
                                              </div>
                                              <div className="rounded-xl bg-white p-3 border border-[var(--border)] shadow-sm">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Purpose / Reason</p>
                                                <p className="mt-1 font-bold text-[var(--text)]">{request.purpose}</p>
                                              </div>
                                            </div>

                                            <div className="mt-6 flex items-center gap-3">
                                              <button className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all">
                                                <Eye className="h-4 w-4" />
                                                View Profile
                                              </button>
                                              <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--card-soft)] active:scale-95 transition-all">
                                                Entity History
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="pt-4 flex items-center gap-3">
                                          <button 
                                            onClick={() => updateRequestStatus(request.id, "Approved")}
                                            disabled={request.status === "Approved"}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
                                          >
                                            <FileCheck2 className="h-4 w-4" />
                                            Approve
                                          </button>
                                          <button 
                                            onClick={() => generateFromRequest(request.id)}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all"
                                          >
                                            <Download className="h-4 w-4" />
                                            Generate
                                          </button>
                                          <button 
                                            onClick={() => updateRequestStatus(request.id, "Rejected")}
                                            disabled={request.status === "Rejected"}
                                            className="flex items-center justify-center h-14 w-14 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-40"
                                          >
                                            <XCircle className="h-5 w-5" />
                                          </button>
                                        </div>
                                      </div>

                                      <div className="rounded-3xl border border-[var(--border)] bg-white/60 p-6 shadow-sm backdrop-blur-md">
                                        <div className="flex items-center gap-2 mb-8">
                                          <RotateCcw className="h-4 w-4 text-[var(--primary)]" />
                                          <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Workflow Progress</h5>
                                        </div>
                                        <div className="relative pl-7 space-y-7 before:absolute before:left-[13.5px] before:top-2 before:h-[calc(100%-15px)] before:w-[2px] before:bg-[var(--border)]/60">
                                          {["Requested", "Processing", "Approved", "Generated", "Released"].map((step, idx) => {
                                            const currentIdx = workflowIndex(request, generatedByRequestId.get(request.id));
                                            const isCompleted = idx <= currentIdx;
                                            const isCurrent = idx === currentIdx;
                                            
                                            return (
                                              <div key={step} className="relative flex items-center justify-between group">
                                                <div className={cn(
                                                  "absolute -left-[20.5px] h-4 w-4 rounded-full border-2 border-white shadow-sm transition-all duration-300",
                                                  isCompleted ? "bg-[var(--primary)] ring-4 ring-[var(--primary)]/10" : "bg-[var(--border)]",
                                                  isCurrent && "animate-pulse scale-125"
                                                )} />
                                                <div className="flex flex-col">
                                                  <span className={cn("text-xs font-black uppercase tracking-wider transition-colors", isCompleted ? "text-[var(--text)]" : "text-[var(--muted)]")}>{step}</span>
                                                  {isCurrent && <span className="text-[9px] font-bold text-[var(--primary)] animate-in fade-in slide-in-from-left-1">Wait for update...</span>}
                                                </div>
                                                <span className="text-[10px] text-[var(--muted)] font-black italic tracking-tighter">{isCompleted ? "DONE" : "PENDING"}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedRequestIds.size > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--primary)]/[0.03] px-6 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                        {selectedRequestIds.size}
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)]">Requests Selected</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center h-9 bg-[var(--card)] rounded-xl border border-[var(--border)] px-1">
                        <div className="relative group/bulk flex items-center">
                          <select
                            value={bulkAssignTo}
                            onChange={(e) => {
                              const staff = e.target.value;
                              setBulkAssignTo(staff);
                              if (staff) bulkAssign();
                            }}
                            className="h-7 w-40 bg-transparent px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] outline-none appearance-none cursor-pointer group-hover/bulk:text-[var(--primary)] transition-colors"
                          >
                            <option value="" disabled>Bulk Assign To...</option>
                            {STAFF_MEMBERS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]/40 pointer-events-none group-hover/bulk:text-[var(--primary)] transition-colors" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={bulkApprove}
                        className="flex h-9 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
                      >
                        Bulk Approve
                      </button>
                      <button
                        type="button"
                        onClick={bulkReject}
                        className="flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-[10px] font-bold uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-100"
                      >
                        Bulk Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRequestIds(new Set())}
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-colors px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      Page <span className="text-[var(--text)]">{safeRequestPage}</span> of {requestPages}
                    </span>
                    <div className="h-3 w-px bg-[var(--border)]" />
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
                       Showing <span className="text-[var(--text)]">{paginatedRequests.length}</span> of {requestRows.length} requests
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={safeRequestPage === 1}
                      onClick={() => setRequestPage(p => Math.max(1, p - 1))}
                      className="h-9 min-w-[36px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 disabled:opacity-30 transition-all active:scale-95"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </button>
                    <div className="flex items-center gap-1.5 mx-1">
                      {[...Array(Math.min(5, requestPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setRequestPage(pageNum)}
                            className={cn(
                              "h-9 min-w-[36px] items-center justify-center rounded-xl text-[11px] font-black tracking-tighter transition-all active:scale-95",
                              safeRequestPage === pageNum ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-white border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {requestPages > 5 && <span className="text-[var(--muted)] opacity-30">...</span>}
                    </div>
                    <button 
                      disabled={safeRequestPage === requestPages}
                      onClick={() => setRequestPage(p => Math.min(requestPages, p + 1))}
                      className="h-9 min-w-[36px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 disabled:opacity-30 transition-all active:scale-95"
                    >
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  </div>
                </footer>
              </>
            ) : null}

            {activeTab === "Generated Documents" ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm border-collapse">
                    <thead>
                      <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
                        <th className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={allVisibleDocumentsSelected}
                            onChange={toggleSelectVisibleDocuments}
                            className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                            aria-label="Select all visible documents"
                          />
                        </th>
                        <ThButton label="Document / Type" active={documentSortBy === "type"} direction={documentSortDirection} onClick={() => { setDocumentSortBy("type"); setDocumentSortDirection(d => d === "asc" ? "desc" : "asc"); }} />
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Entity</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Purpose</th>
                        <ThButton label="Generated At" active={documentSortBy === "date"} direction={documentSortDirection} onClick={() => { setDocumentSortBy("date"); setDocumentSortDirection(d => d === "asc" ? "desc" : "asc"); }} />
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Status</th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]/60">
                      {paginatedDocuments.map((document) => {
                        const entity = resolveEntity(document.source, document.entityId);
                        const isSelected = selectedDocumentIds.has(document.id);
                        
                        return (
                          <tr 
                            key={document.id} 
                            className={cn(
                              "group relative transition-all hover:bg-[var(--primary)]/[0.02]",
                              isSelected && "bg-[var(--primary)]/[0.04]"
                            )}
                          >
                            <td className="relative px-4 py-3.5 text-center">
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                              />
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectDocument(document.id)}
                                className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                              />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">{document.code}</span>
                                <span className="tracking-tight text-[var(--text)]">{document.documentType}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                  <Avatar 
                                    src="/avatar.png"
                                    name={entity?.displayName ?? document.entityId} 
                                    hideText 
                                    className="h-9 w-9" 
                                  />
                                  <div className="flex flex-col">
                                    <span className="tracking-tight text-[var(--text)] font-medium">{entity?.displayName ?? document.entityId}</span>
                                    <span className="text-[10px] font-medium text-[var(--muted)]">resident-profile.v1</span>
                                  </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="max-w-[160px] truncate text-xs font-medium text-[var(--muted)]" title={document.purpose}>{document.purpose}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-[var(--text)] tracking-tight">By {document.generatedBy.split(' ')[0]}</span>
                                <span className="text-[10px] font-medium text-[var(--muted)]">{formatDate(document.generatedAt)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <StatusChip status={document.status} tone={documentStatusTone(document.status)} />
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <DropdownMenu
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                                trigger={<MoreHorizontal className="h-4 w-4" />}
                                items={[
                                  { label: "View Document", icon: Eye, onClick: () => setViewDocument(document) },
                                  { label: "Download PDF", icon: Download, onClick: () => downloadDocument(document) },
                                  { label: "Print Document", icon: Printer, onClick: () => printDocument(document) },
                                  { type: "separator" },
                                  { label: "Update Status", icon: Pencil },
                                  { label: "Archive Document", icon: Archive, onClick: () => updateGeneratedStatus(document.id, "Archived"), disabled: document.status === "Archived" },
                                  { label: "Regenerate", icon: RotateCcw, onClick: () => regenerateDocument(document) },
                                  { type: "separator" },
                                  { label: "Delete Permanently", icon: Trash2, className: "text-rose-600 hover:bg-rose-50" },
                                ]}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedDocumentIds.size > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--primary)]/[0.03] px-6 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                        {selectedDocumentIds.size}
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text)]">Documents Selected</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={exportSelectedDocs}
                        className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] transition-all hover:bg-[var(--card-soft)] hover:border-[var(--primary)]/40"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                      </button>
                      <button
                        type="button"
                        onClick={bulkArchive}
                        className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive Selected
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDocumentIds(new Set())}
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-colors px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--card-soft)]/50 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      Page <span className="text-[var(--text)]">{safeDocumentPage}</span> of {documentPages}
                    </span>
                    <div className="h-3 w-px bg-[var(--border)]" />
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
                       Showing <span className="text-[var(--text)]">{paginatedDocuments.length}</span> of {documentRows.length} documents
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={safeDocumentPage === 1}
                      onClick={() => setDocumentPage(p => Math.max(1, p - 1))}
                      className="h-9 min-w-[36px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 disabled:opacity-30 transition-all active:scale-95"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </button>
                    <div className="flex items-center gap-1.5 mx-1">
                      {[...Array(Math.min(5, documentPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setDocumentPage(pageNum)}
                            className={cn(
                              "h-9 min-w-[36px] items-center justify-center rounded-xl text-[11px] font-black tracking-tighter transition-all active:scale-95",
                              safeDocumentPage === pageNum ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-white border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {documentPages > 5 && <span className="text-[var(--muted)] opacity-30">...</span>}
                    </div>
                    <button 
                      disabled={safeDocumentPage === documentPages}
                      onClick={() => setDocumentPage(p => Math.min(documentPages, p + 1))}
                      className="h-9 min-w-[36px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 disabled:opacity-30 transition-all active:scale-95"
                    >
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  </div>
                </footer>
              </>
            ) : null}
          </div>
        </div>
      </main>

          {activeTab === "Analytics" ? (
            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr] transition-all">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex items-center gap-2 border-b border-[var(--border)]/50 pb-3">
                  <Layers3 className="h-4 w-4 text-[var(--primary)]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Request Volume By Type</h2>
                </div>
                <div className="mt-6 space-y-6">
                  {requestTypeCounts().map((row) => (
                    <div key={row.type} className="group">
                      <div className="mb-2.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--primary)]">{row.type}</span>
                        <span className="text-[11px] font-bold text-[var(--muted)]">{row.count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--primary)]/[0.04]">
                        <div 
                          className="h-full rounded-full bg-[var(--primary)] transition-all duration-1000 group-hover:bg-[var(--primary)]" 
                          style={{ width: `${Math.max(6, (row.count / Math.max(1, filteredRequests.length || 1)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex items-center gap-2 border-b border-[var(--border)]/50 pb-3">
                  <UserRound className="h-4 w-4 text-[var(--primary)]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Staff Productivity</h2>
                </div>
                <div className="mt-6 space-y-4">
                  {staffOutput().map((staff) => (
                    <div key={staff.staff} className="group rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/40 p-4 transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--card)]">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[var(--text)]">{staff.staff}</p>
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]/40" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-6 border-t border-[var(--border)]/20 pt-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Assigned</span>
                          <p className="text-sm font-black tracking-tight text-[var(--text)]">{staff.assigned}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Generated</span>
                          <p className="text-sm font-black tracking-tight text-[var(--primary)]">{staff.generated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] p-4 px-5">
              <h2 className="text-sm font-bold text-[var(--text)]">Recent Activity</h2>
              <button className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--text)] active:scale-95">
                View All Activity
              </button>
            </div>
            
            <div className="divide-y divide-[var(--border)]/40 px-5 transition-all">
              {activities
                .filter((activity) => {
                  if (activity.entityType === "request") {
                    return requests.some((request) => request.id === activity.entityId && request.source === activeSource);
                  }
                  return documents.some((document) => document.code === activity.entityId && document.source === activeSource);
                })
                .slice(0, 5)
                .map((activity) => {
                  const getActionStyle = (action: string) => {
                    switch (action) {
                      case "Generated":
                        return { icon: FileCheck2, bg: "bg-emerald-50 text-emerald-600 border-emerald-100/50" };
                      case "Approved":
                        return { icon: CheckCircle2, bg: "bg-amber-50 text-amber-600 border-amber-100/50" };
                      case "Processing":
                        return { icon: FileText, bg: "bg-blue-50 text-blue-600 border-blue-100/50" };
                      case "Rejected":
                        return { icon: XCircle, bg: "bg-rose-50 text-rose-600 border-rose-100/50" };
                      default:
                        return { icon: Clock3, bg: "bg-slate-50 text-slate-600 border-slate-100/50" };
                    }
                  };
                  
                  const style = getActionStyle(activity.action);
                  const IconNode = style.icon;
                  
                  return (
                    <div key={activity.id} className="group flex items-start gap-4 py-4 transition-colors hover:bg-[var(--primary)]/[0.01]">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105", style.bg)}>
                        <IconNode className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1 pt-0.5">
                        <p className="text-sm font-medium leading-relaxed text-[var(--text)]">{activity.message}</p>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                          <span className="font-semibold transition-colors group-hover:text-[var(--text)]">{activity.actor}</span>
                          <span className="opacity-30">•</span>
                          <span>{formatDateTime(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

function RequestDetailsSidebar({ request, entity, onClose, onAction }: { request: DocumentRequest | null; entity: EntitySeed | null | undefined; onClose: () => void; onAction: (action: string) => void }) {
  if (!request) return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50 p-8 text-center">
      <div className="rounded-full bg-[var(--card-soft)] p-4">
        <FileText className="h-8 w-8 text-[var(--muted)]" />
      </div>
      <p className="mt-4 text-sm font-bold text-[var(--text)]">No Request Selected</p>
      <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">Select a row from the list to view full details and management options.</p>
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl animate-in fade-in zoom-in-95 duration-500">
      {/* Header Area */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text)]">Request Details</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm font-bold text-[var(--text)] opacity-60 font-mono">{request.id}</span>
              <span className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                requestStatusTone(request.status)
              )}>
                {request.status}
              </span>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Requested on <span className="text-[var(--text)]">{formatDate(request.requestedAt)} {new Date(request.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="group rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--text)] hover:border-[var(--primary)]/30 active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-32">
        {/* Resident Information */}
        <section>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-4">Resident Information</h3>
          <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)]/30 p-4 shadow-sm transition-all hover:bg-[var(--card)] hover:border-[var(--primary)]/20">
            <Avatar name={entity?.displayName ?? request.entityId} className="h-14 w-14 shrink-0 border-2 border-white shadow-md ring-4 ring-[var(--primary)]/5" />
            <div className="flex-1 min-w-0">
              <h4 className="truncate text-base font-bold text-[var(--text)] leading-tight">{entity?.displayName ?? request.entityId}</h4>
              <p className="mt-1 text-xs text-[var(--muted)] font-medium leading-tight">{entity?.subtitle ?? "Resident Information Details"}</p>
              <div className="mt-3">
                <button className="flex items-center gap-1.5 rounded-lg bg-[var(--primary)]/5 px-2.5 py-1.5 text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors">
                  VIEW RESIDENT PROFILE
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Request Information */}
        <section className="space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Request Information</h3>
          
          <div className="grid gap-5">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60">Document Type</p>
              <p className="text-sm font-bold text-[var(--text)]">{request.documentType}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60">Purpose</p>
              <p className="text-sm font-medium leading-relaxed text-[var(--text)]">{request.purpose}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60">Remarks</p>
              <p className="text-sm text-[var(--muted)] italic leading-relaxed">{request.remarks || "No additional remarks provided by the resident."}</p>
            </div>
          </div>
        </section>

        {/* Assignment */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Assignment</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Assigned To</p>
              {request.assignedTo ? (
                <div className="flex items-center gap-2 rounded-xl bg-[var(--card-soft)] px-3 py-1.5 border border-[var(--border)] shadow-sm">
                  <Avatar name={request.assignedTo} className="h-5 w-5" />
                  <span className="text-xs font-bold text-[var(--text)]">{request.assignedTo}</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-[var(--muted)] opacity-50 italic">Unassigned</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Date Assigned</p>
              <p className="text-xs font-bold text-[var(--text)]">{request.assignedAt ? formatDate(request.assignedAt) : "-"}</p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-6 pb-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Timeline</h3>
          <div className="relative pl-7 space-y-7 before:absolute before:left-[13.5px] before:top-2 before:h-[calc(100%-15px)] before:w-[2px] before:bg-[var(--border)]/60">
             {["Requested", "Processing", "Approved", "Generated", "Released"].map((step, idx) => {
               const isStepCompleted = (step === "Requested") || (request.status === "Approved" && (step === "Processing" || step === "Approved"));
               return (
                 <div key={step} className="relative group">
                    <div className={cn(
                      "absolute -left-[20.5px] h-4 w-4 rounded-full border-2 border-white shadow-sm transition-all duration-300",
                      isStepCompleted ? "bg-[var(--primary)] ring-4 ring-[var(--primary)]/10" : "bg-[var(--border)]"
                    )} />
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm font-bold transition-colors", isStepCompleted ? "text-[var(--text)]" : "text-[var(--muted)]")}>{step}</span>
                      {step === "Requested" && <span className="text-[10px] font-medium text-[var(--muted)]">{formatDate(request.requestedAt)}</span>}
                      {step !== "Requested" && <span className="text-lg text-[var(--border)]">—</span>}
                    </div>
                 </div>
               );
             })}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 w-full bg-white/80 p-6 pt-0 backdrop-blur-lg border-t border-[var(--border)]">
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] py-3 text-xs font-black uppercase tracking-widest text-[var(--muted)] transition-all hover:bg-[var(--card-soft)] hover:text-[var(--text)] active:scale-95"
          >
            CLOSE
          </button>
          <button 
            onClick={() => onAction("Generate")}
            className="rounded-xl bg-[var(--primary)] py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_10px_25px_-5px_var(--primary)] transition-all hover:brightness-110 active:scale-95"
          >
            PROCESS REQUEST
          </button>
        </div>
      </div>
    </div>
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

  const iconBg = 
    tone === "amber" ? "bg-amber-50" :
    tone === "blue" ? "bg-blue-50" :
    tone === "rose" ? "bg-rose-50" :
    tone === "cyan" ? "bg-cyan-50" :
    tone === "purple" ? "bg-purple-50" : "bg-emerald-50";

  return (
    <article className={cn(
      "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--primary)]/20",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
      tone === "amber" ? "before:bg-amber-400" :
      tone === "blue" ? "before:bg-blue-400" :
      tone === "rose" ? "before:bg-rose-400" :
      tone === "cyan" ? "before:bg-cyan-400" :
      tone === "purple" ? "before:bg-purple-400" : "before:bg-emerald-400"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
          <p className="text-3xl font-bold text-[var(--text)]">{value}</p>
        </div>
        <div className={cn("rounded-xl p-2.5", iconBg, toneClass.split(' ')[2])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {viewAllText && (
        <div className="group mt-4 flex items-center justify-between border-t border-[var(--border)]/50 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] transition-colors group-hover:text-[var(--primary)]">
            {viewAllText}
          </span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--card-soft)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </article>
  );
}

function StatusPill({ status, tone }: { status: string; tone: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", tone)}>
      {status}
    </span>
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
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">{label}</span>
      <div className="relative group/select">
        <select 
          value={value} 
          onChange={(event) => onChange(event.target.value)} 
          className="h-10 w-full appearance-none rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)]"
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

function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-1">{label}</span>
      <div className="relative group/date">
        <input 
          type="date" 
          value={value} 
          onChange={(event) => onChange(event.target.value)} 
          className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-3 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]/40 hover:border-[var(--border-hover)] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
        />
        <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]/40 pointer-events-none transition-colors group-focus-within/date:text-[var(--primary)]" />
      </div>
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

function ThButton({
  label,
  active,
  direction,
  onClick,
  className,
}: {
  label: string;
  active?: boolean;
  direction?: "asc" | "desc";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 text-left", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
          active ? "text-[var(--primary)]" : "text-[var(--muted)]",
          !onClick && "cursor-default"
        )}
      >
        {label}
        {onClick && (
          <ArrowUpDown
            className={cn(
              "h-3 w-3 transition-transform",
              active && direction === "desc" ? "rotate-180" : ""
            )}
          />
        )}
      </button>
    </th>
  );
}

function StatusChip({ status, tone, className }: { status: string; tone: string; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", tone, className)}>
      {status}
    </span>
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl">
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
