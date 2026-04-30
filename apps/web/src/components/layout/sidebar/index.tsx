"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { navigation } from "@/config/navigation";
import { useTenant } from "@/core/tenant/tenant-provider";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNavGroup } from "./sidebar-nav-group";
import { SidebarFooter } from "./sidebar-footer";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const { tenant } = useTenant();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  function toggleMenu(label: string) {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col",
          "bg-gradient-to-b from-[#04122f] via-[#071b45] to-[#05112e]",
          "border-r border-white/8 shadow-2xl",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <SidebarHeader tenant={tenant} collapsed={collapsed} />

        {/* Nav */}
        <div
          className={cn(
            "flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10",
            collapsed ? "px-2" : "px-3"
          )}
        >
          {navigation.map((group) => (
            <SidebarNavGroup
              key={group.title}
              group={group}
              collapsed={collapsed}
              openMenus={openMenus}
              onToggleMenu={toggleMenu}
              onNavigate={onCloseMobile}
            />
          ))}
        </div>

        {/* Footer */}
        <SidebarFooter collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}
    </>
  );
}
