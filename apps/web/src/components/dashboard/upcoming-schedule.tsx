"use client";

import { Gavel, Users, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    title: "Blotter Hearing",
    time: "2:00 PM",
    type: "Hearing",
    icon: Gavel,
    color: "#EF4444",
    status: "Today"
  },
  {
    title: "Barangay Meeting",
    time: "Tomorrow",
    type: "Meeting",
    icon: Users,
    color: "var(--primary)",
    status: "Upcoming"
  },
  {
    title: "Quarterly Report",
    time: "Friday",
    type: "Deadline",
    icon: Bell,
    color: "#F59E0B",
    status: "Deadline"
  }
];

export function UpcomingSchedule() {
  return (
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl text-slate-800 dark:text-slate-100 italic">Upcoming</h2>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
        {events.map((event, idx) => {
          const Icon = event.icon;
          return (
            <div key={idx} className="relative flex items-start gap-4 group">
              {/* Timeline Indicator */}
              <div 
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${event.color}15`, color: event.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[var(--primary)] transition-colors">
                    {event.title}
                  </p>
                  <span className={cn(
                    "shrink-0 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                    event.status === "Today" 
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" 
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    {event.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  {event.time}
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">{event.type}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="mt-8 w-full rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
        View Full Calendar
      </button>
    </article>
  );
}
