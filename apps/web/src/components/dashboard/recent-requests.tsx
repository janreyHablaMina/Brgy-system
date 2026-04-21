"use client";

import { ChevronRight, Clock, CheckCircle2, History } from "lucide-react";
import { cn } from "@/lib/utils";

const requests = [
  { 
    name: "Juan Dela Cruz", 
    type: "Clearance", 
    status: "Pending", 
    time: "10m ago",
    level: "warning" 
  },
  { 
    name: "Maria Santos", 
    type: "Residency", 
    status: "Approved", 
    time: "25m ago",
    level: "success" 
  },
  { 
    name: "Antonio Luna", 
    type: "Certificate", 
    status: "Pending", 
    time: "45m ago",
    level: "warning" 
  },
  { 
    name: "Gabriela Silang", 
    type: "Clearance", 
    status: "Approved", 
    time: "1h ago",
    level: "success" 
  },
];

export function RecentRequests() {
  return (
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200">
          <History className="h-5 w-5 text-slate-400" />
          Recent Requests
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Last 24 Hours
        </span>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
        {requests.map((request, idx) => (
          <div 
            key={idx} 
            className="group flex w-full items-center gap-4 px-6 py-4 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[var(--primary)] transition-colors">
                  {request.name}
                </p>
                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {request.type}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                {request.time}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
                request.level === "warning" 
                  ? "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400" 
                  : "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              )}>
                {request.level === "warning" ? (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  </span>
                ) : (
                  <CheckCircle2 className="h-3 w-3" />
                )}
                {request.status}
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/20 px-6 py-3">
        <button className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors uppercase tracking-widest">
          View All Document Requests
        </button>
      </div>
    </article>
  );
}
