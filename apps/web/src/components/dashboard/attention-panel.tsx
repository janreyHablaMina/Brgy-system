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
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-rose-50 dark:border-rose-500/5 bg-rose-50/30 dark:bg-rose-500/5 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          Needs Attention
        </h2>
        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
          Priority
        </span>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <button
              key={alert.label}
              className="group flex w-full items-center gap-4 px-6 py-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-500 transition-colors">
                  {alert.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                  {alert.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {alert.count}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/20 px-6 py-3">
        <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">
          View All Priority Tasks
        </button>
      </div>
    </article>
  );
}
