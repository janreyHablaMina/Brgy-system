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
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
          <Calendar className="h-3.5 w-3.5 text-[var(--muted)]" />
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
            <div key={event.title} className="flex items-center gap-2.5 rounded-lg bg-[var(--card-soft)] px-3 py-2 transition-colors hover:brightness-110">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${event.iconClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight text-[var(--text)]">{event.title}</p>
                <p className="truncate text-[11px] text-[var(--muted)]">{event.time} · {event.place}</p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", statusClass[event.status] ?? "bg-[var(--card-soft)] text-[var(--muted)]")}>
                {event.status}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

