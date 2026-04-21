"use client";

import { useState } from "react";
import { Announcements } from "@/components/dashboard/announcements";
import { cn } from "@/lib/utils";

const railViews = [
  { id: "today", label: "Today" },
  { id: "bulletin", label: "Bulletin" },
  { id: "insights", label: "Insights" },
  { id: "tools", label: "Tools" },
] as const;

const todayStats = [
  { label: "Clearances Issued", value: "12" },
  { label: "New Residents", value: "5" },
  { label: "Requests Received", value: "8" },
  { label: "Cases Scheduled", value: "3" },
];

const insightStats = [
  { label: "Residents Growth", value: "+12.5%" },
  { label: "Avg Clearance Time", value: "5 mins" },
  { label: "Top Request", value: "Residency" },
  { label: "System Status", value: "Operational" },
];

const tools = ["Add Resident", "Generate Clearance", "New Request", "View Reports"];

type RailViewId = (typeof railViews)[number]["id"];

export function DashboardRightRail() {
  const [activeView, setActiveView] = useState<RailViewId>("today");

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800/80 dark:bg-slate-900">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Control Rail
        </p>
        <div className="grid grid-cols-2 gap-2">
          {railViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                activeView === view.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "today" && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Today Snapshot</h3>
          <div className="space-y-2">
            {todayStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeView === "bulletin" && <Announcements />}

      {activeView === "insights" && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Insights</h3>
          <div className="space-y-2">
            {insightStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeView === "tools" && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Quick Tools</h3>
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool}
                type="button"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {tool}
              </button>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
