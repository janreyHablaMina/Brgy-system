"use client";

import { UserCircle2 } from "lucide-react";

const staff = [
  { name: "Maria Santos", initial: "M", output: "12 documents processed", score: 12, max: 15, bar: "bg-emerald-500" },
  { name: "Juan Dela Cruz", initial: "J", output: "5 residents added", score: 5, max: 15, bar: "bg-blue-500" },
  { name: "Ana Reyes", initial: "A", output: "8 requests approved", score: 8, max: 15, bar: "bg-violet-500" },
];

export function StaffActivity() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <UserCircle2 className="h-3.5 w-3.5 text-slate-400" />
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
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  {member.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate leading-tight">
                    {member.output}
                  </p>
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-800 shrink-0">{member.score}</p>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-100">
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
