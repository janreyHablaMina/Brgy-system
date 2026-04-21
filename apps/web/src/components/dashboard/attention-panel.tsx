"use client";

import { AlertCircle, FileWarning, Gavel, IdCard, ChevronRight } from "lucide-react";

const alerts = [
  { 
    label: "Pending Clearance", 
    count: 14, 
    level: "high", 
    icon: FileWarning,
    description: "Requests awaiting captain signature"
  },
  { 
    label: "Unapproved Documents", 
    count: 8, 
    level: "medium", 
    icon: AlertCircle,
    description: "New application record verifications"
  },
  { 
    label: "Blotter Cases", 
    count: 3, 
    level: "high", 
    icon: Gavel,
    description: "Mediation headers scheduled for today"
  },
  { 
    label: "Expiring IDs", 
    count: 24, 
    level: "low", 
    icon: IdCard,
    description: "Resident IDs reaching end of validity"
  },
];

export function AttentionPanel() {
  return (
    <article className="overflow-hidden rounded-2xl border border-rose-200/70 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex items-center justify-between border-b border-rose-200/60 px-5 py-4 dark:border-rose-900/40">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-200">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          Needs Attention
        </h2>
        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Priority
        </span>
      </div>

      <div className="divide-y divide-rose-100/80 dark:divide-rose-900/30">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <button
              key={alert.label}
              className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/60 dark:hover:bg-rose-950/20"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-slate-500 transition-colors group-hover:text-rose-500 dark:bg-slate-900">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-rose-600 dark:text-slate-200">
                  {alert.label}
                </p>
                <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {alert.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="text-xl font-semibold text-rose-600 dark:text-rose-500">
                    {alert.count}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white/60 px-5 py-3 dark:bg-rose-950/10">
        <button className="text-xs font-semibold uppercase tracking-widest text-rose-500 transition-colors hover:text-rose-600">
          View All Priority Tasks
        </button>
      </div>
    </article>
  );
}
