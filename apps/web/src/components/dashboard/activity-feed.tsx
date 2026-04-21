"use client";

import { cn } from "@/lib/utils";
import { ACTIVITY_LOGS } from "@/lib/mock-data";

export function ActivityFeed() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Operations Stream</h2>
          <p className="text-xs text-slate-400">Real-time status updates</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-[var(--primary)] transition-colors">
          View History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
        {ACTIVITY_LOGS.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                  item.color
                )}
              >
                {item.initials}
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                  item.type === "REQUEST" ? "bg-emerald-50 text-emerald-600" :
                  item.type === "UPDATE" ? "bg-amber-50 text-amber-600" :
                  item.type === "APPROVAL" ? "bg-indigo-50 text-indigo-600" :
                  "bg-slate-50 text-slate-600"
                )}
              >
                {item.type}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {item.actor}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-400">
                {item.action}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <span className={cn("h-1.5 w-1.5 rounded-full", 
                item.type === "APPROVAL" ? "bg-indigo-500" : 
                item.type === "REQUEST" ? "bg-emerald-500" : "bg-slate-300"
              )} />
              <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
