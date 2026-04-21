"use client";

import {
  AlertCircle,
  ChevronRight,
  FileWarning,
  Gavel,
  IdCard,
} from "lucide-react";

const items = [
  {
    label: "Pending Clearance",
    detail: "Requests awaiting captain signature",
    count: 14,
    icon: FileWarning,
    iconClass: "bg-rose-100 text-rose-500",
  },
  {
    label: "Unapproved Documents",
    detail: "New application record verifications",
    count: 8,
    icon: AlertCircle,
    iconClass: "bg-amber-100 text-amber-500",
  },
  {
    label: "Blotter Cases",
    detail: "Mediation headers scheduled for today",
    count: 3,
    icon: Gavel,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    label: "Expiring IDs",
    detail: "Resident IDs reaching end of validity",
    count: 24,
    icon: IdCard,
    iconClass: "bg-blue-100 text-blue-600",
  },
];

export function NeedsAttention() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
          Needs Attention
        </h2>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View all
        </button>
      </header>

      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className="group flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-slate-50"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
            <p className="text-xl font-semibold text-rose-500">{item.count}</p>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5" />
          </button>
        );
      })}
    </article>
  );
}
