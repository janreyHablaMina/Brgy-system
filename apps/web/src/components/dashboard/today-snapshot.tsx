"use client";

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { SNAPSHOT_METRICS } from "@/lib/mock-data";

export function TodaySnapshot() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Activity className="h-4 w-4 text-emerald-500" />
          Today&apos;s Snapshot
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {SNAPSHOT_METRICS.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-slate-900">{metric.value}</span>
              {metric.trend && (
                <span className={cn("text-[9px] font-bold", 
                  metric.isPositive ? "text-emerald-500" : "text-rose-500"
                )}>
                  {metric.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
