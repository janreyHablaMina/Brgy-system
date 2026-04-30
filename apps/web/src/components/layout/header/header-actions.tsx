"use client";

import {
  Bell,
  Bot,
  ChevronDown,
  HelpCircle,
  Languages,
  LogOut,
  Maximize,
  MessageCircle,
  Settings,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import { ColorPicker } from "@/components/ui/color-picker";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/config/routes";
import { useTenant } from "@/core/tenant/tenant-provider";

const NOTIFICATION_COUNT = 5;
const MESSAGE_COUNT = 2;

export function HeaderActions() {
  const { tenant } = useTenant();

  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {/* Messages */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Messages"
      >
        <MessageCircle className="h-4.5 w-4.5" />
        {MESSAGE_COUNT > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0f172a]">
            {MESSAGE_COUNT}
          </span>
        )}
      </button>

      {/* Notifications */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {NOTIFICATION_COUNT > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0f172a]">
            {NOTIFICATION_COUNT}
          </span>
        )}
      </button>

      {/* Accent Color Picker */}
      <ColorPicker compact />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Fullscreen */}
      <button
        type="button"
        className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:flex"
        aria-label="Toggle Fullscreen"
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }}
      >
        <Maximize className="h-4 w-4" />
      </button>

      {/* Vertical Separator */}
      <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" />

      {/* Profile Dropdown */}
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="group flex items-center gap-1.5 rounded-full p-0.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="User profile"
          >
            <div className="relative">
              <Image
                src="/avatar.png"
                alt="Janrey"
                width={38}
                height={38}
                className="rounded-full border border-slate-200 dark:border-slate-700/60 object-cover p-0.5 transition group-hover:border-[var(--primary)]"
              />
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-600" />
          </button>
        }
        items={[
          { label: "My Profile", icon: UserCircle2, href: ROUTES.settings },
          { label: "Account Settings", icon: Settings, href: ROUTES.settings },
          { label: "Get Help", icon: HelpCircle, href: "/help-center" },
          {
            label: "Divider",
            component: <div className="my-1 mx-2 h-px bg-[var(--border)]" />,
          },
          { label: "Sign Out", icon: LogOut, onClick: () => undefined, danger: true },
        ]}
      />
    </div>
  );
}
