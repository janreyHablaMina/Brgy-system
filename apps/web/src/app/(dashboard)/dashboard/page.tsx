import { DailyBriefing } from "@/components/dashboard/daily-briefing";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentRequests } from "@/components/dashboard/recent-requests";
import { StaffActivity } from "@/components/dashboard/staff-activity";
import { AttentionPanel } from "@/components/dashboard/attention-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SecondaryPanels } from "@/components/dashboard/secondary-panels";
import { Announcements } from "@/components/dashboard/announcements";
import { LiveClockBadge } from "@/components/dashboard/live-clock-badge";

export default function DashboardPage() {
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
        <LiveClockBadge />
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

            {/* Pillar 11: Staff Accountability */}
            <StaffActivity />

            {/* Pillar 3: Activity Stream */}
            <ActivityFeed />
          </div>

          {/* Sidebar Column (Pillars 5, 6, 7, 9, 10, 12) */}
          <div className="space-y-8">
            <Announcements />
            <SecondaryPanels />
          </div>
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
