"use client";

import { FileCheck, UserPlus, Inbox, Calendar } from "lucide-react";

export function DailyBriefing() {
  const stats = [
    { label: "Clearances Issued Today", value: "12", icon: FileCheck, color: "var(--primary)" },
    { label: "New Residents Today", value: "5", icon: UserPlus, color: "#10B981" },
    { label: "Requests Received Today", value: "8", icon: Inbox, color: "#F59E0B" },
    { label: "Cases Scheduled Today", value: "3", icon: Calendar, color: "#6366F1" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 dark:border-slate-800/70 dark:bg-slate-900 md:px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Today
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-0">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 md:rounded-none md:border-l md:border-slate-100 md:px-4 md:first:border-l-0 dark:md:border-slate-800"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
