"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  X,
  Gavel,
  Award,
  UserCog,
  ShieldCheck,
  History,
  Headphones,
  ShoppingBag,
  Store,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type NavSubItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavSubItem[];
  badge?: string | number;
  badgeColor?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        children: [
          { label: "Overview", href: "/dashboard" },
          { label: "Reports", href: "/dashboard/reports" },
        ],
      },
      { label: "eCommerce", icon: ShoppingBag, href: "/ecommerce" },
      { label: "Analytics", icon: BarChart3, href: "/analytics" },
      { label: "Calendar", icon: Calendar, href: "/calendar" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Residents", icon: Users, href: "/residents" },
      { label: "Establishments", icon: Store, href: "/establishments" },
      { label: "Documents", icon: FileText, href: "/documents" },
      { label: "Requests", icon: ClipboardList, href: "/requests", badge: "14", badgeColor: "blue" },
      { label: "Blotter / Cases", icon: Gavel, href: "/blotter", badge: "3", badgeColor: "blue" },
      { label: "Certificates", icon: Award, href: "/certificates" },
      { label: "Reports", icon: BarChart3, href: "/reports" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", icon: UserCog, href: "/system/users" },
      { label: "Roles & Permissions", icon: ShieldCheck, href: "/system/roles" },
      { label: "Settings", icon: Settings, href: "/system/settings" },
      { label: "Audit Logs", icon: History, href: "/system/logs" },
    ],
  },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const activeMenus = useMemo(
    () =>
      navigation
        .flatMap((group) => group.items)
        .filter((item) => item.children?.some((child) => child.href === pathname))
        .map((item) => item.label),
    [pathname]
  );

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1C2434] text-[#8A99AF] shadow-2xl transition-all duration-300",
          collapsed ? "w-24" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        {/* Brand Area: Barangay Identity */}
        <div className={cn(
          "relative flex flex-col items-center justify-center pt-10 pb-6 transition-all duration-300",
          collapsed ? "px-2" : "px-6"
        )}>
          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="absolute top-4 right-4 md:hidden text-white"
            aria-label="Close mobile sidebar"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative group">
            {/* Ambient Seal Glow */}
            <div className="absolute -inset-4 rounded-full bg-[var(--primary)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src="/brgy-seal.png"
              alt="Barangay Seal"
              width={80}
              height={80}
              className={cn(
                "relative z-10 transition-all duration-500",
                collapsed ? "h-12 w-12" : "h-20 w-20"
              )}
              style={!collapsed ? { filter: `drop-shadow(0 0 15px rgba(var(--primary-rgb), 0.15))` } : {}}
            />
          </div>
          
          {!collapsed && (
            <div className="mt-4 text-center animate-in fade-in slide-in-from-top-2 duration-700">
              <h1 className="text-[17px] font-bold text-white tracking-wide uppercase">Brgy. Salaza</h1>
              <div 
                className="h-0.5 w-12 mx-auto mt-2 rounded-full" 
                style={{ 
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary)'
                }} 
              />
            </div>
          )}
        </div>

        <div className="h-px bg-white/5 mx-6 mb-6" />

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {navigation.map((group) => (
            <div key={group.title} className="mb-6">
              {!collapsed && (
                <p className="mb-4 text-sm font-semibold text-[#5A6F8A]">{group.title}</p>
              )}
              <nav className="space-y-1.5">
                {group.items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isOpen = openMenus.includes(item.label) || activeMenus.includes(item.label);
                  const isActive = pathname === item.href || item.children?.some(c => c.href === pathname);
                  const Icon = item.icon;

                  return (
                    <div key={item.label}>
                      {hasChildren ? (
                        <button
                          onClick={() => toggleMenu(item.label)}
                          className={cn(
                            "group flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors",
                            isActive ? "bg-[#333A48] text-white" : "hover:bg-[#333A48] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            {!collapsed && <span>{item.label}</span>}
                          </div>
                          {!collapsed && (
                            isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          onClick={onCloseMobile}
                          className={cn(
                            "group flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors",
                            isActive ? "bg-[#333A48] text-white" : "hover:bg-[#333A48] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            {!collapsed && <span>{item.label}</span>}
                          </div>
                          {!collapsed && item.badge && (
                            <span 
                              className="flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold text-white"
                              style={item.badgeColor === "blue" ? { backgroundColor: "var(--primary)" } : { backgroundColor: "var(--accent)" }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}

                      {!collapsed && hasChildren && isOpen && (
                        <div className="mt-1 ml-9 space-y-1 border-l border-[#333A48]">
                          {item.children?.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={onCloseMobile}
                              className={cn(
                                "block px-4 py-2 text-sm font-medium transition-colors",
                                pathname === child.href ? "text-white" : "text-[#8A99AF] hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Help Card */}
        {!collapsed && (
          <div className="px-6 py-4">
            <div className="relative overflow-hidden rounded-xl bg-[#24303F] p-4 group transition-all hover:bg-[#2D3A4B]">
              <div className="absolute -right-4 -top-4 h-16 w-16 bg-[var(--primary)]/10 rounded-full blur-xl group-hover:bg-[var(--primary)]/20 transition-all" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#333A48] text-white shadow-sm border border-white/5">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-tight">Need Help?</p>
                  <p className="text-[10px] font-medium text-[#8A99AF]">Contact Support</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer: Collapse Toggle */}
        <div className="mt-auto p-6 border-t border-white/5">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24303F] px-4 py-3 text-sm font-medium text-[#8A99AF] transition-all hover:bg-[#333A48] hover:text-white group"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 transition-transform group-hover:scale-110" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar overlay"
        />
      ) : null}
    </>
  );
}
