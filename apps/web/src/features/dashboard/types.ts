import type { LucideIcon } from "lucide-react";

export type Tone = "success" | "warning" | "danger" | "info" | "accent" | "neutral";

export type DashboardSummary = {
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "danger" | "neutral";
  icon: LucideIcon;
};

export type DashboardAttentionItem = {
  id: string;
  label: string;
  detail: string;
  cta: string;
  tone: "warning" | "danger" | "accent";
  icon: LucideIcon;
};

export type DashboardActionItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  href?: string;
};

export type DashboardActivityItem = {
  id: string;
  label: string;
  detail: string;
  at: string;
  tone: "success" | "info" | "warning" | "accent";
  icon: LucideIcon;
};

export type DashboardAnnouncementItem = {
  id: string;
  title: string;
  schedule: string;
  note: string;
  isNew?: boolean;
  icon: LucideIcon;
};

export type DashboardStaffItem = {
  id: string;
  name: string;
  role: string;
  processed: number;
  completion: number;
  avatarUrl?: string;
  barColor: string;
};

export type DashboardStatusItem = {
  id: string;
  name: string;
  value: string;
  tone: "success" | "warning" | "danger";
  icon: LucideIcon;
};

export type DashboardOverviewData = {
  tenantId: string;
  barangayId: string;
  tenantName: string;
  needsAttention: DashboardAttentionItem[];
  quickActions: DashboardActionItem[];
  smsCredits: {
    remaining: number;
    usedThisMonth: number;
    total: number;
  };
  summary: DashboardSummary[];
  documentSeries: { day: string; value: number }[];
  mapCluster: { green: number; amber: number; blue: number; red: number };
  recentActivity: DashboardActivityItem[];
  announcements: DashboardAnnouncementItem[];
  staffPerformance: DashboardStaffItem[];
  systemStatus: DashboardStatusItem[];
};
