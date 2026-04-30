import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpenText,
  ClipboardList,
  FileChartColumnIncreasing,
  FileText,
  FolderOpen,
  Globe2,
  History,
  Home,
  LayoutDashboard,
  Mail,
  MapPinned,
  Megaphone,
  Scale,
  Settings,
  Shield,
  Store,
  Users,
  Vote,
} from "lucide-react";
import { ROUTES, type AppRoute } from "@/config/routes";

export type NavSubItem = {
  label: string;
  href: AppRoute;
};

export type NavItem = {
  label: string;
  href?: AppRoute;
  icon: LucideIcon;
  children?: NavSubItem[];
  badge?: string | number;
  badgeColor?: "blue" | "accent";
};

export type NavGroup = {
  title: "Main" | "Management" | "Communication" | "Settings";
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "Main",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: ROUTES.dashboard }],
  },
  {
    title: "Management",
    items: [
      { label: "Residents", icon: Users, href: ROUTES.residents },
      { label: "Voters", icon: Vote, href: ROUTES.voters },
      { label: "Case Records", icon: Scale, href: ROUTES.caseRecords },
      { label: "Blotter Records", icon: ClipboardList, href: ROUTES.blotterRecords },
      { label: "Establishments", icon: Store, href: ROUTES.establishments },
      { label: "Properties", icon: Home, href: ROUTES.properties },
      {
        label: "Documents",
        icon: FileText,
        href: ROUTES.documents,
        children: [
          { label: "Registry", href: ROUTES.documents },
          { label: "Generate New", href: ROUTES.generateDocument },
        ],
      },
      { label: "Requests", icon: ClipboardList, href: ROUTES.requests, badge: "14", badgeColor: "blue" },
      { label: "Reports", icon: FileChartColumnIncreasing, href: ROUTES.reports },
      { label: "File Manager", icon: FolderOpen, href: "/file-manager" as AppRoute },
      { label: "Tanod Management", icon: Shield, href: "/tanod-management" as AppRoute },
      { label: "Barangay Map", icon: MapPinned, href: "/barangay-map" as AppRoute },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "SMS", icon: Mail, href: "/email" as AppRoute, badge: "New", badgeColor: "accent" },
      { label: "Announcements", icon: Megaphone, href: "/help-desk" as AppRoute },
      { label: "Help Center", icon: BookOpenText, href: "/help-center" as AppRoute },
      { label: "Portal Management", icon: Globe2, href: "/portal-management" as AppRoute },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", icon: Settings, href: ROUTES.settings },
      { label: "Audit Logs", icon: History, href: ROUTES.systemLogs },
      { label: "Notifications", icon: Bell, href: ROUTES.settings },
    ],
  },
];
