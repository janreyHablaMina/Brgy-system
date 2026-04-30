"use client";

import type { DashboardOverviewData } from "@/features/dashboard/types";
import { NeedsAttentionSection } from "@/features/dashboard/sections/needs-attention-section";
import { QuickActionsSection } from "@/features/dashboard/sections/quick-actions-section";
import { SmsCreditsCard } from "@/features/dashboard/sections/sms-credits-card";
import { SummaryCardsSection } from "@/features/dashboard/sections/summary-cards-section";
import { DocumentsChartSection } from "@/features/dashboard/sections/documents-chart-section";
import { ResidentsMapSection } from "@/features/dashboard/sections/residents-map-section";
import { RecentActivitySection } from "@/features/dashboard/sections/recent-activity-section";
import { AnnouncementsSection } from "@/features/dashboard/sections/announcements-section";
import { StaffPerformanceSection } from "@/features/dashboard/sections/staff-performance-section";
import { SystemStatusSection } from "@/features/dashboard/sections/system-status-section";

type DashboardOverviewProps = {
  data: DashboardOverviewData;
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  return (
    <div className="space-y-5">
      {/* Row 1: Needs Attention + Quick Actions + SMS Credits */}
      <section className="grid gap-4 xl:grid-cols-[2fr_2fr_1.1fr]">
        <NeedsAttentionSection items={data.needsAttention} />
        <QuickActionsSection items={data.quickActions} />
        <SmsCreditsCard
          remaining={data.smsCredits.remaining}
          usedThisMonth={data.smsCredits.usedThisMonth}
          total={data.smsCredits.total}
        />
      </section>

      {/* Row 2: Summary KPI Cards */}
      <SummaryCardsSection items={data.summary} />

      {/* Row 3: Documents Chart + Residents Map + Recent Activity */}
      <section className="grid gap-4 xl:grid-cols-[2fr_1.5fr_1.5fr]">
        <DocumentsChartSection series={data.documentSeries} />
        <ResidentsMapSection cluster={data.mapCluster} />
        <RecentActivitySection items={data.recentActivity} />
      </section>

      {/* Row 4: Staff Performance + System Status + Announcements */}
      <section className="grid gap-4 xl:grid-cols-[2fr_1fr_1.2fr]">
        <StaffPerformanceSection items={data.staffPerformance} />
        <SystemStatusSection items={data.systemStatus} />
        <AnnouncementsSection items={data.announcements} />
      </section>
    </div>
  );
}
