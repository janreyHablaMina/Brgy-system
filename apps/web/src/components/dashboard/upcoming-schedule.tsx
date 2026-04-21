"use client";

import { Bell, Calendar, Gavel, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  { title: "Blotter Hearing", time: "2:00 PM", place: "Barangay Hall", status: "Today", icon: Gavel, iconClass: "bg-rose-100 text-rose-500" },
  { title: "Barangay Meeting", time: "Tomorrow", place: "9:00 AM", status: "Upcoming", icon: Users, iconClass: "bg-blue-100 text-blue-500" },
  { title: "Monthly Report Submission", time: "April 30", place: "5:00 PM", status: "Deadline", icon: Bell, iconClass: "bg-amber-100 text-amber-500" },
];

const statusClass: Record<string, string> = {
  Today: "bg-rose-500 text-white",
  Upcoming: "bg-blue-100 text-blue-600",
  Deadline: "bg-amber-500 text-white",
};

export function UpcomingSchedule() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          Upcoming Schedule
        </h3>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View calendar
        </button>
      </header>

      <div className="space-y-2 p-3">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.title} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2 transition-colors hover:bg-slate-100">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${event.iconClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate leading-tight">{event.title}</p>
                <p className="text-[11px] text-slate-400 truncate">{event.time} · {event.place}</p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusClass[event.status] ?? "bg-slate-100 text-slate-600")}>
                {event.status}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
