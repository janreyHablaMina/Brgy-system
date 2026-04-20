"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={cn("min-h-screen transition-all duration-300", collapsed ? "md:pl-24" : "md:pl-72")}>
        <Header onOpenSidebar={() => setMobileOpen(true)} />
        <main className="space-y-8 px-4 pb-10 pt-7 md:px-8 md:pb-12 md:pt-8">{children}</main>
      </div>
    </div>
  );
}
