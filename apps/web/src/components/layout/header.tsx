"use client";

import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ColorPicker } from "@/components/ui/color-picker";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getPageTitle } from "@/lib/page-title";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export function Header({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  // Dynamic Greeting Logic
  const hour = new Date().getHours();
  const greeting = 
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#111827] px-4 py-2.5 transition-all duration-300 md:px-10 border-b border-slate-200/50 dark:border-slate-800/40">
      <div className="mx-auto flex h-14 items-center justify-between gap-6">
        {/* Left Side: Mobile Menu & Dynamic Greeting */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="group flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-800/50 text-slate-500 transition-all duration-300 hover:bg-[var(--primary)] hover:text-white md:hidden"
            aria-label="Open sidebar"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="hidden lg:block">
            <div className="flex items-center gap-2.5 transition-all hover:opacity-80">
              <img 
                src="/brgyAssist.png" 
                alt="BrgyAssist Logo" 
                className="h-11 w-auto object-contain"
              />
              <span className="font-display text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
                BrgyAssist
              </span>
            </div>
          </div>
        </div>

        {/* Center: Omni-Search / Command Palette */}
        <div className="hidden max-w-2xl flex-1 lg:flex justify-center">
          <div className="group relative flex w-full max-w-md items-center">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[var(--primary)] dark:text-slate-500" strokeWidth={2} />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 pl-11 pr-4 text-sm text-slate-700 dark:text-slate-300 outline-none transition-all duration-300 focus:border-[var(--primary)]/30 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-[var(--primary)]/5 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Right Side: Unified Utility Command Bar & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center h-10 px-1">
            <button className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] text-slate-400 dark:text-slate-500 mx-0.5">
              <MessageSquare className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#10B981] px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#111827]">
                3
              </span>
            </button>
            <button className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] text-slate-400 dark:text-slate-500 mx-0.5">
              <Bell className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EA4335] px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#111827]">
                12
              </span>
            </button>

            {/* Theme Intelligence (Now adjacent to communication tools) */}
            <div className="mx-1">
              <ThemeToggle />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200/80 dark:bg-slate-800/80 mx-1" />

          <DropdownMenu
            className="flex items-center"
            trigger={
              <div className="flex items-center gap-3 pl-1 pr-1 py-1 group cursor-pointer transition-all duration-300">
                <div className="relative">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 rounded-full bg-[var(--primary)]/0 blur-md transition-all duration-500 group-hover:bg-[var(--primary)]/5" />
                  <Avatar 
                    src="/avatar.png" 
                    name="Pauline Seitz" 
                    hideText 
                    className="relative z-10"
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#111827] bg-emerald-500 z-20 shadow-sm" />
                </div>
                <div className="text-left hidden xl:block z-10">
                  <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 leading-none mb-1 tracking-tight group-hover:text-[var(--primary)] transition-colors">Pauline Seitz</p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Administrator</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 transition-all duration-300 group-hover:text-slate-500 z-10 ml-0.5" strokeWidth={2.5} />
              </div>
            }
            items={[
              { label: "My Profile", icon: UserCircle2, href: "/settings" },
              { label: "Account Settings", icon: Settings, href: "/settings" },
              { label: "System Theme", component: <div className="px-2 py-1"><ColorPicker /></div> },
              { label: "Divider", component: <div className="h-px bg-slate-100 my-1 mx-2" /> },
              { label: "Get Help", icon: HelpCircle, href: "/help" },
              { label: "Sign Out", icon: LogOut, onClick: () => undefined, danger: true },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
