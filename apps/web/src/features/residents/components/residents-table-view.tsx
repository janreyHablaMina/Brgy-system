"use client";

import { 
  ArrowUpDown, 
  Eye, 
  MapPin, 
  MoreHorizontal, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type { 
  Resident, 
  SortBy, 
  SortDirection, 
  UserRole 
} from "../types";
import { computeAge, getFullName } from "../utils";

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: SortableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
          active ? "text-[var(--primary)]" : "text-[var(--primary)] hover:text-[var(--primary)]"
        )}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3 transition-transform", active && direction === "desc" ? "rotate-180" : "")} />
      </button>
    </th>
  );
}

interface ResidentsTableViewProps {
  residents: Resident[];
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  sortBy: SortBy;
  sortDirection: SortDirection;
  onSort: (field: SortBy) => void;
  onView: (resident: Resident) => void;
  onEdit: (resident: Resident) => void;
  onDelete: (ids: string[]) => void;
  role: UserRole;
}

export function ResidentsTableView({
  residents,
  selectedIds,
  allVisibleSelected,
  onToggleSelectAll,
  onToggleSelectRow,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  role,
}: ResidentsTableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-soft)]/90 backdrop-blur-md">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleSelectAll}
                className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                aria-label="Select all visible residents"
              />
            </th>
            <SortableHeader
              label="Barangay ID"
              active={sortBy === "id"}
              direction={sortDirection}
              onClick={() => onSort("id")}
            />
            <SortableHeader
              label="Full Name"
              active={sortBy === "name"}
              direction={sortDirection}
              onClick={() => onSort("name")}
            />
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Address</th>
            <SortableHeader
              label="Age"
              active={sortBy === "age"}
              direction={sortDirection}
              onClick={() => onSort("age")}
            />
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Gender</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Civil Status</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/40">
          {residents.map((resident) => {
            const age = computeAge(resident.birthdate);
            return (
              <tr key={resident.id} className="group text-[var(--text)]">
                <td className="relative px-4 py-3.5">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <input
                    type="checkbox"
                    checked={selectedIds.has(resident.id)}
                    onChange={() => onToggleSelectRow(resident.id)}
                    className="rounded border-[var(--border)] accent-[var(--accent)] focus:ring-[var(--accent)]/20"
                    aria-label={`Select ${getFullName(resident)}`}
                  />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[11px] font-medium text-[var(--muted)] uppercase">{resident.id}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src="/avatar.png"
                      name={getFullName(resident)}
                      className="h-9 w-9"
                      hideText
                    />
                    <div className="flex flex-col">
                      <span className="tracking-tight text-[var(--text)]">
                        {getFullName(resident)}
                      </span>
                      <span className="text-[10px] font-medium text-[var(--muted)]">
                        resident-profile.v1
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 max-w-[240px] truncate font-medium text-[var(--text)]/80" title={resident.address}>
                  {resident.address}
                </td>
                <td className="px-4 py-3.5 text-[var(--text)]">{age}</td>
                <td className="px-4 py-3.5 text-[var(--muted)] font-medium">{resident.gender}</td>
                <td className="px-4 py-3.5 text-[var(--muted)] font-medium">{resident.civilStatus}</td>
                <td className="px-4 py-3.5">
                  <DropdownMenu
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all hover:bg-[var(--card)] hover:text-[var(--primary)]"
                    trigger={
                      <>
                        <MoreHorizontal className="h-4 w-4" />
                      </>
                    }
                    items={[
                      { label: "View Profile", onClick: () => onView(resident), icon: Eye },
                      { label: "Edit Record", onClick: () => onEdit(resident), icon: Pencil },
                      { label: "Location", onClick: () => {}, icon: MapPin },
                      { label: "Divider", component: <div className="my-1 h-px bg-[var(--border)]/50" /> },
                      { 
                        label: "Delete Resident", 
                        onClick: () => onDelete([resident.id]), 
                        icon: Trash2,
                        disabled: role !== "Admin"
                      },
                    ]}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
