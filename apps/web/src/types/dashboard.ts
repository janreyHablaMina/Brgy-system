import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: "emerald" | "amber" | "blue" | "violet" | "cyan";
  isLive?: boolean;
  trend?: string;
}

export interface AttentionItem {
  label: string;
  detail: string;
  count: number;
  icon: LucideIcon;
  iconClass: string;
}

export interface RecentRequest {
  id: string;
  resident: string;
  type: string;
  time: string;
  status: "pending" | "processing" | "ready";
  avatar?: string;
}

export interface StaffPerformance {
  name: string;
  role: string;
  processed: number;
  target: number;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  type: "REQUEST" | "UPDATE" | "APPROVAL" | "REGISTRATION";
  time: string;
  initials: string;
  color: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "URGENT" | "INFO" | "EVENT";
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
}

export interface SnapshotMetric {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
}
