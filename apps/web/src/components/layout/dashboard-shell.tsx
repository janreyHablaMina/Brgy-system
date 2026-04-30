"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/header/index";
import { Sidebar } from "@/components/layout/sidebar/index";
import { TenantProvider } from "@/core/tenant/tenant-provider";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <TenantProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
            collapsed ? "md:pl-[72px]" : "md:pl-[260px]"
          )}
        >
          <Header onOpenSidebar={() => setMobileOpen(true)} />
          <main className="flex-1 space-y-6 px-4 pb-10 pt-6 md:px-6 md:pb-12 md:pt-7">
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
