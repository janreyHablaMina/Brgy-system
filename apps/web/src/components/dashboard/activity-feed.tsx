"use client";

import { FileText, UserPlus, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    resident: "Juan Dela Cruz",
    action: "Requested Barangay Clearance",
    time: "5 mins ago",
    type: "request",
    icon: FileText,
    color: "var(--primary)",
  },
  {
    resident: "Ana Santos",
    action: "Registry Profile Updated",
    time: "12 mins ago",
    type: "update",
    icon: RotateCcw,
    color: "#8B5CF6",
  },
  {
    resident: "Pauline Seitz",
    action: "Approved 12 Clearance Requests",
    time: "24 mins ago",
    type: "approval",
    icon: CheckCircle2,
    color: "#10B981",
  },
  {
    resident: "Mark Rivera",
    action: "New Resident Registration",
    time: "48 mins ago",
    type: "registration",
    icon: UserPlus,
    color: "#3B82F6",
  },
];

export function ActivityFeed() {
  return (
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Recent Activity</h2>
        <button className="text-xs font-bold text-[var(--primary)] hover:underline uppercase tracking-wide">
          View History
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Timeline Icon */}
                <div 
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                <div className="flex-1 space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">
                      {activity.resident}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.action}
                  </p>
                  
                  {/* Performance Badge */}
                  <div className="pt-2">
                    <span 
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: activity.color }}
                    >
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
