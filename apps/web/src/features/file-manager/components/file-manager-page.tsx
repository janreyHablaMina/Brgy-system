"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Filter,
  Folder,
  Grid3X3,
  ImageIcon,
  List,
  MoreHorizontal,
  MoveRight,
  Pencil,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MOCK_FILES, MOCK_FOLDERS } from "@/features/file-manager/mock-data";
import type { FileItem, FileManagerItem, FileType } from "@/features/file-manager/types";
import { formatDate } from "@/features/residents/utils";

type ViewMode = "grid" | "list";
type CategoryFilter = "All" | "Reports" | "Residents" | "Finance" | "Cases" | "Governance";
type FileTypeFilter = "All" | FileType;

export function FileManagerPage() {
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState<FileTypeFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [uploadedAt, setUploadedAt] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPreview, setSelectedPreview] = useState<FileItem | null>(null);

  const allItems = useMemo<FileManagerItem[]>(() => [...MOCK_FOLDERS, ...MOCK_FILES], []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allItems
      .filter((item) => (query ? item.name.toLowerCase().includes(query) : true))
      .filter((item) => (item.kind === "file" && fileType !== "All" ? item.fileType === fileType : true))
      .filter((item) => (item.kind === "file" && category !== "All" ? item.category === category : true))
      .filter((item) => (item.kind === "file" && uploadedAt ? item.uploadedAt === uploadedAt : true))
      .filter((item) => (item.kind === "file" && uploadedBy ? item.uploadedBy.toLowerCase().includes(uploadedBy.toLowerCase()) : true));
  }, [allItems, search, fileType, category, uploadedAt, uploadedBy]);

  const stats = useMemo(() => {
    const totalStorageMb = MOCK_FILES.reduce((sum, item) => sum + item.sizeMb, 0);
    const sharedFiles = MOCK_FILES.filter((item) => item.shared).length;
    return {
      totalStorageMb,
      totalFiles: MOCK_FILES.length,
      totalFolders: MOCK_FOLDERS.length,
      sharedFiles,
    };
  }, []);

  function resetFilters() {
    setSearch("");
    setFileType("All");
    setCategory("All");
    setUploadedAt("");
    setUploadedBy("");
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">File Manager</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Centralized document storage for barangay files, reports, case attachments, and records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Upload className="h-4 w-4" />
              Upload File
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Plus className="h-4 w-4" />
              Create Folder
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TopCard label="Total Storage Used" value={`${stats.totalStorageMb.toFixed(1)} MB`} />
          <TopCard label="Total Files" value={String(stats.totalFiles)} />
          <TopCard label="Total Folders" value={String(stats.totalFolders)} />
          <TopCard label="Shared Files" value={String(stats.sharedFiles)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by file name..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
              />
            </div>
          </label>
          <SelectField label="File Type" value={fileType} options={["All", "PDF", "Image", "Document"]} onChange={(v) => setFileType(v as FileTypeFilter)} />
          <SelectField
            label="Category"
            value={category}
            options={["All", "Reports", "Residents", "Finance", "Cases", "Governance"]}
            onChange={(v) => setCategory(v as CategoryFilter)}
          />
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Date Uploaded</span>
            <input
              type="date"
              value={uploadedAt}
              onChange={(e) => setUploadedAt(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
            />
          </label>
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Uploaded By</span>
            <input
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="Optional"
              className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]/40"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm font-semibold text-[var(--text)]"
            >
              Reset Filters
            </button>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn("rounded-md p-2", viewMode === "grid" ? "bg-[var(--primary)] text-white" : "text-[var(--muted)]")}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn("rounded-md p-2", viewMode === "list" ? "bg-[var(--primary)] text-white" : "text-[var(--muted)]")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="border-b border-[var(--border)] px-4 py-3 text-xs font-semibold text-[var(--muted)]">
          Home &gt; Reports &gt; 2026
        </div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <GridItem key={item.id} item={item} onPreview={setSelectedPreview} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Size / Count</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Uploaded By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/50">
                {filtered.map((item) => (
                  <ListRow key={item.id} item={item} onPreview={setSelectedPreview} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--text)]">Preview: {selectedPreview.name}</h3>
              <button onClick={() => setSelectedPreview(null)} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]">
                Close
              </button>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-4 text-sm text-[var(--muted)]">
              File preview placeholder for {selectedPreview.fileType}. Integrate PDF/Image renderer here.
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function TopCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function GridItem({ item, onPreview }: { item: FileManagerItem; onPreview: (item: FileItem) => void }) {
  const icon = item.kind === "folder" ? <Folder className="h-5 w-5 text-[var(--primary)]" /> : item.fileType === "Image" ? <ImageIcon className="h-5 w-5 text-emerald-600" /> : <FileText className="h-5 w-5 text-indigo-600" />;
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-sm font-semibold text-[var(--text)]">{item.name}</p>
        </div>
        <RowActions item={item} onPreview={onPreview} />
      </div>
      {item.kind === "file" ? (
        <div className="mt-2 space-y-1 text-xs text-[var(--muted)]">
          <p>{item.sizeMb.toFixed(1)} MB</p>
          <p>{formatDate(item.uploadedAt)} • {item.uploadedBy}</p>
          <p className="inline-flex rounded-full border border-[var(--border)] px-2 py-0.5">{item.category}</p>
        </div>
      ) : (
        <div className="mt-2 space-y-1 text-xs text-[var(--muted)]">
          <p>{item.fileCount} files inside</p>
          <p>Created {formatDate(item.createdAt)}</p>
        </div>
      )}
    </article>
  );
}

function ListRow({ item, onPreview }: { item: FileManagerItem; onPreview: (item: FileItem) => void }) {
  return (
    <tr className="text-[var(--text)]">
      <td className="px-4 py-3">{item.name}</td>
      <td className="px-4 py-3">{item.kind === "folder" ? "Folder" : item.fileType}</td>
      <td className="px-4 py-3">{item.kind === "folder" ? `${item.fileCount} files` : `${item.sizeMb.toFixed(1)} MB`}</td>
      <td className="px-4 py-3">{item.kind === "folder" ? formatDate(item.createdAt) : formatDate(item.uploadedAt)}</td>
      <td className="px-4 py-3">{item.kind === "folder" ? "-" : item.uploadedBy}</td>
      <td className="px-4 py-3">{item.kind === "folder" ? "-" : item.category}</td>
      <td className="px-4 py-3">
        <RowActions item={item} onPreview={onPreview} />
      </td>
    </tr>
  );
}

function RowActions({ item, onPreview }: { item: FileManagerItem; onPreview: (item: FileItem) => void }) {
  return (
    <DropdownMenu
      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--card)]"
      trigger={<MoreHorizontal className="h-4 w-4 text-[var(--muted)]" />}
      items={[
        ...(item.kind === "file" ? [{ label: "View / Preview", icon: Eye, onClick: () => onPreview(item) }] : []),
        { label: "Download", icon: Download, onClick: () => null },
        { label: "Rename", icon: Pencil, onClick: () => null },
        { label: "Move to Folder", icon: MoveRight, onClick: () => null },
        { label: "Delete", icon: Trash2, onClick: () => null },
        { label: "Share", icon: Share2, onClick: () => null },
      ]}
    />
  );
}
