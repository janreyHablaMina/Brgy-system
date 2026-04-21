"use client";

import { Megaphone, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const bulletin = [
  { tag: "Announcement", title: "Community Clean-up Drive", detail: "This Saturday, 8:00 AM at Barangay Hall", age: "2h ago", type: "announcement", tone: "text-emerald-700 bg-emerald-100" },
  { tag: "System Notice", title: "System Maintenance", detail: "April 22, 2026 · 12:00 AM to 2:00 AM", age: "1d ago", type: "system", tone: "text-rose-700 bg-rose-100" },
];

export function Announcements() {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
          <Megaphone className="h-3.5 w-3.5 text-[var(--muted)]" />
          Bulletin Board
        </h3>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View all
        </button>
      </header>

      <div className="space-y-2.5 p-3">
        {bulletin.map((item) => (
          <div key={item.title} className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3 transition-colors hover:border-[var(--primary)]/30">
            <div className="mb-1.5 flex items-center justify-between">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", item.tone)}>
                {item.type === "system" ? <Terminal className="h-2.5 w-2.5" /> : <Megaphone className="h-2.5 w-2.5" />}
                {item.tag}
              </span>
              <span className="text-[10px] text-[var(--muted)]">{item.age}</span>
            </div>
            <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{item.detail}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

