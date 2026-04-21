"use client";

import { UserPlus, FileText, BarChart3, PlusCircle } from "lucide-react";

const actions = [
  { label: "Add Resident", icon: UserPlus, description: "Register new household member" },
  { label: "Generate Clearance", icon: FileText, description: "Issue official barangay certification" },
  { label: "View Reports", icon: BarChart3, description: "Analyze demographic data" },
  { label: "New Request", icon: PlusCircle, description: "Log a new service inquiry" },
];

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-800/70 dark:bg-slate-900 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Quick Actions
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-left transition-colors hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 transition-colors group-hover:bg-[var(--primary)] group-hover:text-white dark:bg-slate-900">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[var(--primary)] dark:text-slate-200">
                  {action.label}
                </p>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
