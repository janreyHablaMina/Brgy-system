"use client";

import { Users, User } from "lucide-react";
import { STAFF_ACTIVITY } from "@/lib/mock-data";

export function StaffActivity() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Users className="h-3.5 w-3.5 text-blue-500" />
          Staff Accountability
        </h2>
      </header>

      <div className="divide-y divide-slate-100">
        {STAFF_ACTIVITY.map((staff) => (
          <div key={staff.name} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{staff.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{staff.role}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {staff.processed} documents
              </span>
            </div>
            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-1000"
                style={{ width: `${(staff.processed / staff.target) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
