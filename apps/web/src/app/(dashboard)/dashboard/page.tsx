"use client";

import { useEffect, useState } from "react";
import { DailyBriefing } from "@/components/dashboard/daily-briefing";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentRequests } from "@/components/dashboard/recent-requests";
import { AttentionPanel } from "@/components/dashboard/attention-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SecondaryPanels } from "@/components/dashboard/secondary-panels";

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateString = time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Welcome & Identity Section */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-12 w-[1.5px] bg-[var(--primary)]/30 dark:bg-[var(--primary)]/40 hidden md:block" />
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              <span>Dashboard</span>
              <span className="opacity-30">/</span>
              <span className="text-[var(--primary)]/70">Overview</span>
            </p>
            <h1 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 transition-all">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Activity &
              </span>
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                insights
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 border border-slate-200/50 dark:border-slate-800/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {timeString} • {dateString}
          </p>
        </div>
      </section>
      <div className="space-y-10">
        {/* Daily Summary: Today's Briefing */}
        <DailyBriefing />

        {/* Pillar 1: Quick Summary Metrics */}
        <DashboardMetrics />

        {/* Pillar 4: Quick Actions Command Bar */}
        <QuickActions />

        {/* Primary Action & Activity Grid */}
        <section className="grid gap-8 lg:grid-cols-3">
          {/* Main Column (Pillars 2 & 3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pillar 2: Action Required / Needs Attention */}
            <AttentionPanel />

            {/* Pillar 8: Recent Service Requests */}
            <RecentRequests />

            {/* Pillar 3: Activity Stream */}
            <ActivityFeed />
          </div>

          {/* Sidebar Column (Pillars 5, 6, 7) */}
          <SecondaryPanels />
        </section>
      </div>
      
      {/* Decorative Footer Accent */}
      <div className="mt-20 flex items-center justify-center gap-4 opacity-20">
        <div className="h-px w-10 bg-slate-400"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Lingkod 2026 Vision</p>
        <div className="h-px w-10 bg-slate-400"></div>
      </div>
    </div>
  );
}
