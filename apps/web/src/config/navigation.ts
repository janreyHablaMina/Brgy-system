import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  FileText,
  History,
  Home,
  LayoutDashboard,
  Scale,
  Settings,
  ShieldCheck,
  Store,
  UserCog,
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
  badgeColor?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: ROUTES.dashboard }],
  },
  {
    title: "MANAGEMENT",
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
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", icon: UserCog, href: ROUTES.systemUsers },
      { label: "Roles & Permissions", icon: ShieldCheck, href: ROUTES.systemRoles },
      { label: "Settings", icon: Settings, href: ROUTES.systemSettings },
      { label: "Audit Logs", icon: History, href: ROUTES.systemLogs },
    ],
  },
];
