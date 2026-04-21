"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { TODAY_SCHEDULE } from "@/lib/mock-data";

export function UpcomingSchedule() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <CalendarDays className="h-4 w-4 text-amber-500" />
          Today&apos;s Schedule
        </h2>
      </header>

      <div className="space-y-3">
        {TODAY_SCHEDULE.map((item) => (
          <div
            key={item.id}
            className="group flex gap-3 rounded-lg bg-slate-50/50 p-3 transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex flex-col items-center justify-center rounded-md bg-white border border-slate-100 px-2 min-w-[50px]">
              <span className="text-[10px] font-black text-[var(--primary)] uppercase">
                {item.time.split(" ")[1]}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {item.time.split(" ")[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[var(--primary)] transition-colors">
                {item.title}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
