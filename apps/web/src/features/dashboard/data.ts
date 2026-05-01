import {
  AlertTriangle,
  FileText,
  UserPlus,
  CreditCard,
  MessageSquare,
  Megaphone,
  BarChart2,
  MapPin,
  FileCheck,
  Users,
  ClipboardList,
  Database,
  Server,
  Wifi,
  HardDrive,
  Shield,
  CheckCircle,
  Calendar,
} from "lucide-react";
import type { DashboardOverviewData } from "@/features/dashboard/types";
import { ROUTES } from "@/config/routes";

export function getDashboardOverviewData(tenantId: string, tenantName: string): DashboardOverviewData {
  return {
    tenantId,
    barangayId: tenantId,
    tenantName,

    needsAttention: [
      {
        id: "pending-requests",
        label: "12 Pending Requests",
        detail: "Documents waiting for approval",
        cta: "Review Now",
        tone: "warning",
        icon: ClipboardList,
      },
      {
        id: "overdue-docs",
        label: "5 Overdue Documents",
        detail: "Documents past the target date",
        cta: "View Now",
        tone: "danger",
        icon: FileText,
      },
      {
        id: "unpaid-payments",
        label: "3 Unpaid Payments",
        detail: "Payments that need to be collected",
        cta: "View Now",
        tone: "accent",
        icon: CreditCard,
      },
    ],

    quickActions: [
      { id: "add-resident", label: "Add Resident", icon: UserPlus, iconBg: "#EFF6FF", iconColor: "#3B82F6", href: ROUTES.newResident },
      { id: "issue-document", label: "Issue Document", icon: FileText, iconBg: "#F0FDF4", iconColor: "#22C55E", href: ROUTES.generateDocument },
      { id: "file-blotter", label: "File Blotter", icon: Shield, iconBg: "#F5F3FF", iconColor: "#8B5CF6", href: ROUTES.blotterRecords },
      { id: "record-payment", label: "Record Payment", icon: CreditCard, iconBg: "#FFFBEB", iconColor: "#F59E0B", href: ROUTES.reports },
      { id: "send-sms", label: "Send SMS", icon: MessageSquare, iconBg: "#EFF6FF", iconColor: "#3B82F6", href: "/email" },
      { id: "announcement", label: "Announcement", icon: Megaphone, iconBg: "#F0FDF4", iconColor: "#22C55E", href: "/help-desk" },
      { id: "generate-report", label: "Generate Report", icon: BarChart2, iconBg: "#FFF1F2", iconColor: "#F43F5E", href: ROUTES.reports },
      { id: "view-map", label: "View Map", icon: MapPin, iconBg: "#F0FDF4", iconColor: "#22C55E", href: "/barangay-map" },
    ],

    smsCredits: { remaining: 1000, usedThisMonth: 250, total: 1250 },

    summary: [
      { label: "Total Residents", value: "2,450", delta: "+12 this month", tone: "success", icon: Users },
      { label: "Documents Issued", value: "350", delta: "+18 this week", tone: "warning", icon: FileCheck },
      { label: "Pending Requests", value: "12", delta: "High Priority", tone: "danger", icon: ClipboardList },
      { label: "Today's Collections", value: "₱8,450", delta: "+15% vs yesterday", tone: "neutral", icon: CreditCard },
    ],

    documentSeries: [
      { day: "Mon", value: 30 },
      { day: "Tue", value: 52 },
      { day: "Wed", value: 50 },
      { day: "Thu", value: 75 },
      { day: "Fri", value: 90 },
      { day: "Sat", value: 58 },
      { day: "Sun", value: 40 },
    ],

    mapCluster: { green: 12, amber: 8, blue: 5, red: 15 },

    recentActivity: [
      { id: "a1", label: "Document approved", detail: "Barangay Clearance for Pedro Santos", at: "2 mins ago", tone: "warning", icon: FileCheck },
      { id: "a2", label: "New resident added", detail: "Maria Garcia", at: "15 mins ago", tone: "info", icon: UserPlus },
      { id: "a3", label: "Payment recorded", detail: "Official Receipt #OR-2026-00123", at: "30 mins ago", tone: "warning", icon: CreditCard },
      { id: "a4", label: "Blotter filed", detail: "Blotter #BLT-2026-00045", at: "1 hour ago", tone: "accent", icon: Shield },
      { id: "a5", label: "Document issued", detail: "Certificate of Indigency for Juan Dela Cruz", at: "2 hours ago", tone: "success", icon: FileText },
    ],

    announcements: [
      { id: "n1", title: "Barangay Assembly", schedule: "May 25, 2026 • 8:00 AM", note: "At Barangay Hall", isNew: true, icon: Megaphone },
      { id: "n2", title: "Clean-up Drive", schedule: "May 18, 2026 • 6:00 AM", note: "Let's keep our barangay clean!", isNew: true, icon: Calendar },
    ],

    staffPerformance: [
      { id: "s1", name: "Ana Reyes", role: "Encoder", processed: 120, completion: 90, barColor: "#22C55E" },
      { id: "s2", name: "Pedro Santos", role: "Staff", processed: 98, completion: 78, barColor: "#3B82F6" },
      { id: "s3", name: "Maria Cruz", role: "Staff", processed: 87, completion: 70, barColor: "#8B5CF6" },
      { id: "s4", name: "Juan Dela Cruz", role: "Admin", processed: 150, completion: 95, barColor: "#F59E0B" },
    ],

    systemStatus: [
      { id: "st1", name: "Database", value: "Online", tone: "success", icon: Database },
      { id: "st2", name: "SMS Gateway", value: "Connected", tone: "success", icon: Wifi },
      { id: "st3", name: "Server", value: "Online", tone: "success", icon: Server },
      { id: "st4", name: "Backup", value: "Up to date", tone: "success", icon: HardDrive },
    ],
  };
}

