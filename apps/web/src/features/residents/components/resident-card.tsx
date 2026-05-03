"use client";

import { 
  Briefcase, 
  Eye, 
  MapPin, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  User, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type { Resident, UserRole } from "../types";
import { computeAge, getFullName } from "../utils";

export function TagBadge({ 
  label, 
  color = "slate" 
}: { 
  label: string; 
  color?: "slate" | "blue" | "violet" | "emerald" 
}) {
  const styles = {
    slate: "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700/50",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-500/20",
    violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100/50 dark:border-violet-500/20",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-500/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
      styles[color]
    )}>
      {label}
    </span>
  );
}

interface ResidentCardProps {
  resident: Resident;
  onView: (resident: Resident) => void;
  onEdit: (resident: Resident) => void;
  onDelete: (id: string) => void;
  role: UserRole;
}

export function ResidentCard({
  resident,
  onView,
  onEdit,
  onDelete,
  role,
}: ResidentCardProps) {
  const age = computeAge(resident.birthdate);
  const name = getFullName(resident);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-extrabold tracking-[0.1em] text-slate-400 dark:text-slate-500 uppercase">
          {resident.id}
        </span>
        <DropdownMenu
          trigger={
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer">
              <MoreVertical className="h-4.5 w-4.5" />
            </div>
          }
          items={[
            { label: "View Location", onClick: () => {}, icon: MapPin },
            { label: "Divider", component: <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" /> },
            { 
              label: "Delete Resident", 
              onClick: () => onDelete(resident.id), 
              icon: Trash2,
              danger: true,
              disabled: role !== "Admin"
            },
          ]}
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <Avatar
            src="/avatar.png"
            name={name}
            className="h-14 w-14 rounded-2xl shadow-sm ring-4 ring-slate-50/50 dark:ring-slate-800/50"
            hideText
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 truncate leading-tight mb-1">
            {name}
          </h3>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 opacity-80">
            {resident.address}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50 grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <User className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Age</span>
          </div>
          <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{age} yrs</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Users className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Gender</span>
          </div>
          <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{resident.gender}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Briefcase className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
          </div>
          <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200 truncate">{resident.civilStatus}</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {resident.tags.senior && <TagBadge label="Senior" color="blue" />}
          {resident.tags.pwd && <TagBadge label="PWD" color="violet" />}
          {resident.tags.voter && <TagBadge label="Voter" color="emerald" />}
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onView(resident)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100/50 dark:border-slate-700/50"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onEdit(resident)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-slate-100/50 dark:border-slate-700/50"
            title="Edit"
          >
            <Pencil className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
