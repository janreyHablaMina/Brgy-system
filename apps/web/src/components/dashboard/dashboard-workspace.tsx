"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentRequests } from "@/components/dashboard/recent-requests";
import { StaffActivity } from "@/components/dashboard/staff-activity";
import { cn } from "@/lib/utils";

const views = [
  { id: "requests", label: "Requests Queue" },
  { id: "activity", label: "Live Activity" },
  { id: "staff", label: "Staff Output" },
] as const;

type ViewId = (typeof views)[number]["id"];

export function DashboardWorkspace() {
  const [activeView, setActiveView] = useState<ViewId>("requests");

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Focus Workspace
          </p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Operations Feed</h2>
        </div>

        <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 dark:bg-slate-800 md:w-auto">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors md:flex-none",
                activeView === view.id
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "requests" && <RecentRequests />}
      {activeView === "activity" && <ActivityFeed />}
      {activeView === "staff" && <StaffActivity />}
    </section>
  );
}
