"use client";

import { Activity, ShieldCheck, Database, HardDrive, Landmark, Users as UsersIcon } from "lucide-react";
import { UpcomingSchedule } from "./upcoming-schedule";

export function SecondaryPanels() {
  return (
    <div className="space-y-6">
      <UpcomingSchedule />

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Growth Trends</h2>
          <Activity className="h-4 w-4 text-[var(--primary)]" />
        </div>

        <div className="relative h-20 w-full">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 100 24">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 24 L0 20 Q 15 12, 25 18 T 50 10 T 75 14 T 100 4 L 100 24 Z" fill="url(#gradient)" />
            <path
              d="M0 20 Q 15 12, 25 18 T 50 10 T 75 14 T 100 4"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Residents Growth</p>
          <span className="text-sm font-semibold text-[var(--primary)]">+12.5%</span>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-200">Service Integrity</h2>
        <div className="space-y-2">
          {[
            { label: "Document Engine", status: "Operational", icon: ShieldCheck, color: "#10B981" },
            { label: "Cloud Sync", status: "Synchronized", icon: Database, color: "var(--primary)" },
            { label: "Data Backup", status: "Pending Fix", icon: HardDrive, color: "#F59E0B" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4" style={{ color: item.color }} />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Barangay Profile</h2>
          <Landmark className="h-4 w-4 text-slate-400" />
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Barangay</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Brgy. Salaza</p>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Captain</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Hon. P. Seitz</p>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Households</p>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">2,420</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
