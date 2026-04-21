"use client";

import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANNOUNCEMENTS } from "@/lib/mock-data";

export function Announcements() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Megaphone className="h-4 w-4 text-indigo-500" />
          Bulletins
        </h2>
        <button className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-[var(--primary)] transition-colors">
          View All
        </button>
      </header>

      <div className="space-y-3">
        {ANNOUNCEMENTS.map((bulletin) => (
          <div
            key={bulletin.id}
            className="group relative rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-200/50"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em]",
                  bulletin.type === "URGENT" ? "bg-rose-500 text-white" :
                  bulletin.type === "EVENT" ? "bg-amber-100 text-amber-700" :
                  "bg-indigo-100 text-indigo-700"
                )}
              >
                {bulletin.type}
              </span>
              <span className="text-[9px] font-bold text-slate-400">{bulletin.date}</span>
            </div>
            <h3 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
              {bulletin.title}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {bulletin.content}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
