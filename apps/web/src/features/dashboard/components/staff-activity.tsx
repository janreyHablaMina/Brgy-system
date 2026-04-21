"use client";

import { UserCircle2 } from "lucide-react";

const staff = [
  { name: "Maria Santos", initial: "M", output: "12 documents processed", score: 12, max: 15, bar: "bg-emerald-500" },
  { name: "Juan Dela Cruz", initial: "J", output: "5 residents added", score: 5, max: 15, bar: "bg-blue-500" },
  { name: "Ana Reyes", initial: "A", output: "8 requests approved", score: 8, max: 15, bar: "bg-violet-500" },
];

export function StaffActivity() {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
          <UserCircle2 className="h-3.5 w-3.5 text-[var(--muted)]" />
          Staff Accountability
        </h3>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View all
        </button>
      </header>

      <div className="space-y-3 px-4 py-3">
        {staff.map((member) => (
          <div key={member.name}>
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--card-soft)] text-xs font-semibold text-[var(--muted)]">
                  {member.initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-tight text-[var(--text)]">
                    {member.name}
                  </p>
                  <p className="truncate text-[11px] leading-tight text-[var(--muted)]">
                    {member.output}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-lg font-semibold text-[var(--text)]">{member.score}</p>
            </div>
            <div className="h-1 w-full rounded-full bg-[var(--card-soft)]">
              <div
                className={`h-1 rounded-full transition-all ${member.bar}`}
                style={{ width: `${Math.min((member.score / member.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
