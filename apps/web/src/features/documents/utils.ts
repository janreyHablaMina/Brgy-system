import type {
  ActivityLog,
  DocumentRequest,
  DocumentSource,
  DocumentType,
  EntityRecord,
  GeneratedDocument,
  GeneratedStatus,
  RequestStatus,
} from "./types";

const DAY = 24 * 60 * 60 * 1000;

export function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function inRange(value: string, from: string, to: string) {
  const target = new Date(value).getTime();
  const start = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
  const end = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
  return target >= start && target <= end;
}

export function createRequestId(existing: DocumentRequest[]) {
  const year = new Date().getFullYear();
  const max = Math.max(
    0,
    ...existing
      .map((entry) => Number.parseInt(entry.id.split("-").at(-1) ?? "0", 10))
      .filter(Number.isFinite)
  );
  return `REQ-${year}-${String(max + 1).padStart(5, "0")}`;
}

export function createDocumentCode(existing: GeneratedDocument[]) {
  const year = new Date().getFullYear();
  const max = Math.max(
    0,
    ...existing
      .map((entry) => Number.parseInt(entry.code.split("-").at(-1) ?? "0", 10))
      .filter(Number.isFinite)
  );
  return `DOC-${year}-${String(max + 1).padStart(5, "0")}`;
}

export function createActivityId(existing: ActivityLog[]) {
  const max = Math.max(
    0,
    ...existing
      .map((entry) => Number.parseInt(entry.id.split("-").at(-1) ?? "0", 10))
      .filter(Number.isFinite)
  );
  return `ACT-${String(max + 1).padStart(6, "0")}`;
}

export function getValidityDate(type: DocumentType, generatedAt: string) {
  const base = new Date(generatedAt).getTime();
  if (type === "Barangay Clearance") return new Date(base + 180 * DAY).toISOString();
  if (type === "Certificate of Residency") return new Date(base + 365 * DAY).toISOString();
  return undefined;
}

export function requestMatchesSearch(
  request: DocumentRequest,
  entity: EntityRecord | undefined,
  search: string
) {
  const q = normalize(search);
  if (!q) return true;

  return [
    request.id,
    request.source,
    request.documentType,
    request.purpose,
    entity?.displayName ?? "",
    entity?.id ?? "",
    request.assignedTo ?? "",
  ]
    .map(normalize)
    .some((field) => field.includes(q));
}

export function documentMatchesSearch(
  document: GeneratedDocument,
  entity: EntityRecord | undefined,
  search: string
) {
  const q = normalize(search);
  if (!q) return true;

  return [
    document.code,
    document.source,
    document.documentType,
    document.purpose,
    entity?.displayName ?? "",
    entity?.id ?? "",
    document.generatedBy,
  ]
    .map(normalize)
    .some((field) => field.includes(q));
}

export function sortRequests(
  rows: DocumentRequest[],
  entities: Map<string, EntityRecord>,
  by: "date" | "name" | "type",
  direction: "asc" | "desc"
) {
  return [...rows].sort((a, b) => {
    let valueA = "";
    let valueB = "";

    if (by === "date") {
      valueA = String(new Date(a.requestedAt).getTime());
      valueB = String(new Date(b.requestedAt).getTime());
    } else if (by === "name") {
      valueA = entities.get(entityKey(a.source, a.entityId))?.displayName ?? "";
      valueB = entities.get(entityKey(b.source, b.entityId))?.displayName ?? "";
    } else {
      valueA = a.documentType;
      valueB = b.documentType;
    }

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function sortDocuments(
  rows: GeneratedDocument[],
  entities: Map<string, EntityRecord>,
  by: "date" | "name" | "type",
  direction: "asc" | "desc"
) {
  return [...rows].sort((a, b) => {
    let valueA = "";
    let valueB = "";

    if (by === "date") {
      valueA = String(new Date(a.generatedAt).getTime());
      valueB = String(new Date(b.generatedAt).getTime());
    } else if (by === "name") {
      valueA = entities.get(entityKey(a.source, a.entityId))?.displayName ?? "";
      valueB = entities.get(entityKey(b.source, b.entityId))?.displayName ?? "";
    } else {
      valueA = a.documentType;
      valueB = b.documentType;
    }

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function requestStatusTone(status: RequestStatus) {
  if (status === "Pending") return "border-amber-300/30 bg-amber-500/10 text-amber-600";
  if (status === "Processing") return "border-indigo-300/30 bg-indigo-500/10 text-indigo-600";
  if (status === "Approved") return "border-emerald-300/30 bg-emerald-500/10 text-emerald-600";
  return "border-rose-300/30 bg-rose-500/10 text-rose-600";
}

export function documentStatusTone(status: GeneratedStatus) {
  if (status === "Generated") return "border-indigo-300/30 bg-indigo-500/10 text-indigo-600";
  if (status === "Released") return "border-emerald-300/30 bg-emerald-500/10 text-emerald-600";
  return "border-slate-300/30 bg-slate-500/10 text-slate-600 dark:text-slate-300";
}

export function sourceTone(source: DocumentSource) {
  if (source === "Residents") return "border-cyan-300/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300";
  if (source === "Establishments") return "border-fuchsia-300/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300";
  if (source === "Lots / Buildings") return "border-amber-300/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "border-rose-300/30 bg-rose-500/10 text-rose-700 dark:text-rose-300";
}

export function entityKey(source: DocumentSource, entityId: string) {
  return `${source}::${entityId}`;
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
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

export function exportCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadBlob(filename, csv, "text/csv;charset=utf-8;");
}

export function downloadMockPdf(filename: string, lines: string[]) {
  const content = lines.join("\n");
  downloadBlob(filename, content, "application/pdf;charset=utf-8;");
}
