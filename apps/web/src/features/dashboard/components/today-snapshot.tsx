"use client";

import { FileCheck, Inbox, Calendar, UserPlus } from "lucide-react";

const stats = [
  { label: "Clearances Issued", value: 12, icon: FileCheck, color: "text-[var(--primary)]" },
  { label: "New Residents", value: 5, icon: UserPlus, color: "text-emerald-500" },
  { label: "Requests Received", value: 8, icon: Inbox, color: "text-amber-500" },
  { label: "Cases Scheduled", value: 3, icon: Calendar, color: "text-violet-500" },
];

export function TodaySnapshot() {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <header className="border-b border-[var(--border)] px-4 py-2.5">
        <h3 className="text-sm font-semibold text-[var(--text)]">Today Snapshot</h3>
      </header>

      <div className="divide-y divide-[var(--border)]">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-[var(--card-soft)]">
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                <p className="text-sm text-[var(--muted)]">{item.label}</p>
              </div>
              <p className="text-lg font-semibold text-[var(--text)]">{item.value}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
