"use client";

import { Bell, HelpCircle, LogOut, MessageCircle, Settings, UserCircle2 } from "lucide-react";
import Image from "next/image";
import { ColorPicker } from "@/components/ui/color-picker";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/config/routes";
import { useTenant } from "@/core/tenant/tenant-provider";
import { DEFAULT_USER_NAME } from "@/lib/config";

const NOTIFICATION_COUNT = 3;

export function HeaderActions() {
  const { tenant } = useTenant();

  return (
    <div className="flex items-center gap-1.5">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Accent Color */}
      <ColorPicker compact />

      {/* Messages */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[var(--primary)] dark:hover:text-[var(--primary)]"
        aria-label="Messages"
      >
        <MessageCircle className="h-4 w-4" />
      </button>

      {/* Notifications */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[var(--primary)] dark:hover:text-[var(--primary)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {NOTIFICATION_COUNT > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-sm">
            {NOTIFICATION_COUNT}
          </span>
        )}
      </button>

      {/* Profile Dropdown */}
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-700"
            aria-label="User profile"
          >
            <Image
              src={tenant.sealUrl ?? "/brgy-seal.png"}
              alt={tenant.displayName}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <div className="hidden text-left sm:block">
              <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {DEFAULT_USER_NAME}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                Barangay Admin
              </p>
            </div>
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
