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

  return (
    <header className="sticky top-0 z-20 bg-white px-4 py-2.5 transition-all duration-300 md:px-10 border-b border-slate-200/50">
      <div className="mx-auto flex h-14 items-center justify-between gap-6">
        {/* Left Side: Mobile Menu & Breadcrumb-style title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="group flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100/80 text-slate-500 transition-all duration-300 hover:bg-[#3C50E0] hover:text-white md:hidden"
            aria-label="Open sidebar"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Barangay Admin</p>
            <p className="text-sm font-bold tracking-tight text-slate-900">{title}</p>
          </div>
        </div>

        {/* Center: Omni-Search / Command Palette */}
        <div className="hidden max-w-2xl flex-1 lg:flex justify-center">
          <div className="group relative flex w-full max-w-md items-center">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#3C50E0]" strokeWidth={2} />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-full border border-slate-200/60 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 focus:border-[#3C50E0]/30 focus:bg-white focus:ring-4 focus:ring-[#3C50E0]/5 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Side: Unified Utility Command Bar & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 p-1 transition-all">
            {/* Group 1: Communication & Intelligence (Now alone in the bar) */}
            <div className="flex items-center gap-0.5">
              <button className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-white hover:text-[#3C50E0] text-slate-400 shadow-none hover:shadow-sm">
                <MessageSquare className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#10B981] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </button>
              <button className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-white hover:text-[#3C50E0] text-slate-400 shadow-none hover:shadow-sm">
                <Bell className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EA4335] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  12
                </span>
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Group 2: Theme Intelligence (Moved up) */}
            <ThemeToggle />
          </div>

          <div className="h-6 w-px bg-slate-200/80 mx-1" />

          <DropdownMenu
            className="flex items-center"
            trigger={
              <div className="flex items-center gap-3 pl-1 pr-1 py-1 group cursor-pointer transition-all duration-300">
                <div className="relative">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 rounded-full bg-[#3C50E0]/0 blur-md transition-all duration-500 group-hover:bg-[#3C50E0]/5" />
                  <Avatar 
                    src="/avatar.png" 
                    name="Pauline Seitz" 
                    hideText 
                    className="relative z-10"
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 z-20 shadow-sm" />
                </div>
                <div className="text-left hidden xl:block z-10">
                  <p className="text-[14px] font-bold text-slate-800 leading-none mb-1 tracking-tight group-hover:text-[#3C50E0] transition-colors">Pauline Seitz</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Administrator</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-300 transition-all duration-300 group-hover:text-slate-500 group-hover:translate-y-0.5 z-10 ml-0.5" strokeWidth={2.5} />
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
