"use client";

import { FileCheck, UserPlus, Inbox, Calendar } from "lucide-react";

export function DailyBriefing() {
  const stats = [
    { label: "Clearances Issued", value: "12", icon: FileCheck, color: "var(--primary)" },
    { label: "New Residents", value: "5", icon: UserPlus, color: "#10B981" },
    { label: "Requests Received", value: "8", icon: Inbox, color: "#F59E0B" },
    { label: "Cases Scheduled", value: "3", icon: Calendar, color: "#6366F1" },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100">Today</h2>
        <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 p-4 transition-all duration-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm"
            >
              <div 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
