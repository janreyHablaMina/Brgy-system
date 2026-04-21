import { 
  ShieldCheck, 
  Scale, 
  Users, 
  Clock3, 
  FileBadge,
  FileWarning,
  AlertCircle,
  Gavel,
  IdCard
} from "lucide-react";
import { 
  DashboardStat, 
  AttentionItem, 
  RecentRequest, 
  StaffPerformance, 
  ActivityLog, 
  Announcement,
  ScheduleItem,
  SnapshotMetric
} from "@/types/dashboard";

export const SUMMARY_STATS: DashboardStat[] = [
  {
    label: "Queue Health",
    value: "Stable",
    note: "All systems normal",
    icon: ShieldCheck,
    color: "emerald",
    isLive: true,
  },
  {
    label: "Priority Cases",
    value: "3",
    note: "Requires attention",
    icon: Scale,
    color: "amber",
    isLive: false,
  },
  {
    label: "Staff Online",
    value: "3",
    note: "Active now",
    icon: Users,
    color: "blue",
    isLive: true,
  },
  {
    label: "Avg Turnaround",
    value: "5m",
    note: "This week",
    icon: Clock3,
    color: "violet",
    isLive: false,
  },
  {
    label: "Documents Today",
    value: "12",
    note: "Compared to yesterday",
    trend: "+20%",
    icon: FileBadge,
    color: "cyan",
    isLive: false,
  },
];

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    label: "Pending Clearance",
    detail: "Requests awaiting captain signature",
    count: 14,
    icon: FileWarning,
    iconClass: "bg-rose-100 text-rose-500",
  },
  {
    label: "Unapproved Documents",
    detail: "New application record verifications",
    count: 8,
    icon: AlertCircle,
    iconClass: "bg-amber-100 text-amber-500",
  },
  {
    label: "Blotter Cases",
    detail: "Mediation headers scheduled for today",
    count: 3,
    icon: Gavel,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    label: "Expiring IDs",
    detail: "Resident IDs reaching end of validity",
    count: 24,
    icon: IdCard,
    iconClass: "bg-blue-100 text-blue-600",
  },
];

export const RECENT_REQUESTS: RecentRequest[] = [
  {
    id: "1",
    resident: "Juan Dela Cruz",
    type: "Barangay Clearance",
    time: "10 mins ago",
    status: "ready",
  },
  {
    id: "2",
    resident: "Maria Santos",
    type: "Residency Certificate",
    time: "25 mins ago",
    status: "processing",
  },
  {
    id: "3",
    resident: "Antonio Luna",
    type: "Indigency Certificate",
    time: "1 hour ago",
    status: "pending",
  },
  {
    id: "4",
    resident: "Gabriela Silang",
    type: "Business Permit",
    time: "2 hours ago",
    status: "processing",
  },
];

export const STAFF_ACTIVITY: StaffPerformance[] = [
  {
    name: "Pauline Seitz",
    role: "Administrator",
    processed: 45,
    target: 50,
  },
  {
    name: "James Wilson",
    role: "Front Desk",
    processed: 12,
    target: 50,
  },
  {
    name: "Sarah Chen",
    role: "Secretary",
    processed: 38,
    target: 50,
  },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    actor: "Pauline Seitz",
    action: "approved Barangay Clearance for Juan Dela Cruz",
    type: "APPROVAL",
    time: "5 mins ago",
    initials: "PS",
    color: "bg-indigo-500",
  },
  {
    id: "act-2",
    actor: "James Wilson",
    action: "submitted a new clearance request",
    type: "REQUEST",
    time: "12 mins ago",
    initials: "JW",
    color: "bg-emerald-500",
  },
  {
    id: "act-3",
    actor: "Sarah Chen",
    action: "updated residency details for Maria Santos",
    type: "UPDATE",
    time: "25 mins ago",
    initials: "SC",
    color: "bg-amber-500",
  },
  {
    id: "act-4",
    actor: "Admin System",
    action: "registered new resident: Antonio Luna",
    type: "REGISTRATION",
    time: "1 hour ago",
    initials: "AS",
    color: "bg-slate-500",
  },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "System Maintenance",
    content: "Scheduled downtime on Saturday, 10:00 PM.",
    date: "April 20",
    type: "URGENT",
  },
  {
    id: "ann-2",
    title: "Barangay Assembly",
    content: "Community meeting at the main hall on Sunday.",
    date: "April 19",
    type: "EVENT",
  },
  {
    id: "ann-3",
    title: "Vaccination Drive",
    content: "Flu shots available for seniors this Friday.",
    date: "April 18",
    type: "INFO",
  },
];

export const TODAY_SCHEDULE: ScheduleItem[] = [
  {
    id: "sch-1",
    title: "Budget Review",
    time: "09:00 AM",
    location: "Conference Room A",
  },
  {
    id: "sch-2",
    title: "Resident Mediation",
    time: "01:30 PM",
    location: "Office 204",
  },
];

export const SNAPSHOT_METRICS: SnapshotMetric[] = [
  { label: "Daily Revenue", value: "₱12,450", trend: "+15%", isPositive: true },
  { label: "Active Users", value: "124", trend: "+5%", isPositive: true },
  { label: "Pending Issues", value: "8", trend: "-2", isPositive: true },
];
