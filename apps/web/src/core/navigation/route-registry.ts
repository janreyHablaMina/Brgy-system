import {
  BarChart3,
  BookOpenText,
  Boxes,
  ClipboardList,
  CloudLightning,
  FileText,
  FolderOpen,
  Globe2,
  History,
  Home,
  IdCard,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MapPinned,
  Scale,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Store,
  type LucideIcon,
  UserCog,
  Users,
  VenusAndMars,
  Vote,
  Wallet,
} from "lucide-react";

export type AppNavSubItem = {
  label: string;
  href: string;
};

export type AppNavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: AppNavSubItem[];
  badge?: string | number;
  badgeColor?: "blue" | "accent";
};

export type AppNavGroup = {
  title: string;
  items: AppNavItem[];
};

export const APP_NAVIGATION: AppNavGroup[] = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Residents", icon: Users, href: "/residents" },
      { label: "Voters", icon: Vote, href: "/voters" },
      { label: "Case Records", icon: Scale, href: "/case-records" },
      { label: "Blotter Records", icon: ClipboardList, href: "/blotter-records" },
      { label: "VAWC Desk", icon: ShieldAlert, href: "/vawc" },
      { label: "Establishments", icon: Store, href: "/establishments" },
      { label: "Properties", icon: Home, href: "/properties" },
      {
        label: "Documents",
        icon: FileText,
        href: "/documents",
        children: [
          { label: "Registry", href: "/documents" },
          { label: "Generate New", href: "/documents/generate" },
        ],
      },
      { label: "Requests", icon: ClipboardList, href: "/requests", badge: "14", badgeColor: "blue" },
      { label: "Reports", icon: BarChart3, href: "/reports" },
      { label: "Email", icon: Mail, href: "/email" },
      { label: "File Manager", icon: FolderOpen, href: "/file-manager" },
      { label: "Portal Management", icon: Globe2, href: "/portal-management" },
      { label: "Help Desk", icon: LifeBuoy, href: "/help-desk" },
      { label: "Tanod Management", icon: Shield, href: "/tanod-management" },
      { label: "Finance Management", icon: Wallet, href: "/finance-management" },
      { label: "Inventory & Assets", icon: Boxes, href: "/inventory-assets" },
      { label: "DRRM", icon: CloudLightning, href: "/drrm" },
      { label: "GAD Management", icon: VenusAndMars, href: "/gad-management" },
      { label: "Personnel Management", icon: IdCard, href: "/personnel-management" },
      { label: "Help Center", icon: BookOpenText, href: "/help-center" },
      { label: "Barangay Map", icon: MapPinned, href: "/barangay-map" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", icon: UserCog, href: "/system/users" },
      { label: "Roles & Permissions", icon: ShieldCheck, href: "/system/roles" },
      { label: "Settings", icon: Settings, href: "/settings" },
      { label: "Audit Logs", icon: History, href: "/system/logs" },
    ],
  },
];

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/residents": "Residents",
  "/residents/new": "New Resident",
  "/voters": "Voters",
  "/case-records": "Case Records",
  "/blotter-records": "Blotter Records",
  "/vawc": "VAWC Desk",
  "/establishments": "Establishments",
  "/establishments/new": "Add Establishment",
  "/properties": "Properties",
  "/documents": "Documents",
  "/documents/generate": "Generate Document",
  "/requests": "Requests",
  "/reports": "Reports",
  "/email": "Email",
  "/file-manager": "File Manager",
  "/portal-management": "Portal Management",
  "/help-desk": "Help Desk",
  "/tanod-management": "Tanod Management",
  "/finance-management": "Finance Management",
  "/inventory-assets": "Inventory & Assets",
  "/drrm": "DRRM",
  "/gad-management": "GAD Management",
  "/personnel-management": "Personnel Management",
  "/help-center": "Help Center",
  "/barangay-map": "Barangay Map",
  "/settings": "Settings",
  "/system/logs": "Audit Logs",
};

export function getRouteTitle(pathname: string) {
  return ROUTE_TITLES[pathname] ?? "Dashboard";
}
