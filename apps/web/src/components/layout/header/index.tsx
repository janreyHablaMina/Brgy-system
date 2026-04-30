"use client";

import { Menu } from "lucide-react";
import { useTenant } from "@/core/tenant/tenant-provider";
import { HeaderSearch } from "./header-search";
import { HeaderActions } from "./header-actions";

type HeaderProps = {
  onOpenSidebar: () => void;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { tenant } = useTenant();
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800/60 bg-white/95 dark:bg-[var(--card)]/95 backdrop-blur-sm px-4 py-3 md:px-6">

      {/* Left: hamburger + greeting */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Greeting — visible on md+ */}
        <div className="hidden min-w-0 md:block">
          <p className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {greeting}, Janrey! <span aria-hidden>👋</span>
          </p>
          <p className="truncate text-[13px] text-slate-400 dark:text-slate-500">
            Here&apos;s what&apos;s happening in {tenant.displayName} today.
          </p>
        </div>
      </div>

      {/* Center: Search bar */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <HeaderSearch />
      </div>

      {/* Right: action buttons */}
      <div className="ml-auto shrink-0">
        <HeaderActions />
      </div>
    </header>
  );
}
