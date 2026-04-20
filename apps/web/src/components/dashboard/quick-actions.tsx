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
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 text-left transition-all duration-300 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/[0.02] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[var(--primary)] transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
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
