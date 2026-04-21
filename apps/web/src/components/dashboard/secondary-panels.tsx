"use client";

import { Activity, ShieldCheck, Database, HardDrive, Info, Landmark, Users as UsersIcon } from "lucide-react";
import { UpcomingSchedule } from "./upcoming-schedule";

export function SecondaryPanels() {
  return (
    <div className="space-y-6">
      {/* Pillar 9: Upcoming Events & Deadlines */}
      <UpcomingSchedule />

      {/* Pillar 5: Insights / Trends (SVG-based) */}
      <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Growth Trends</h2>
          <Activity className="h-5 w-5 text-[var(--primary)]" />
        </div>
        
        {/* Simple Mini-Chart (SVG) */}
        <div className="relative h-24 w-full">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 100 24">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 24 L0 20 Q 15 12, 25 18 T 50 10 T 75 14 T 100 4 L 100 24 Z"
              fill="url(#gradient)"
            />
            <path
              d="M0 20 Q 15 12, 25 18 T 50 10 T 75 14 T 100 4"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Residents Growth</p>
          <span className="text-sm font-black text-[var(--primary)]">+12.5%</span>
        </div>
      </article>

      {/* Pillar 6: Service Health */}
      <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6">
        <h2 className="mb-6 text-lg font-bold text-slate-800 dark:text-slate-200">Service Integrity</h2>
        <div className="space-y-4">
          {[
            { label: "Document Engine", status: "Operational", icon: ShieldCheck, color: "#10B981" },
            { label: "Cloud Sync", status: "Synchronized", icon: Database, color: "var(--primary)" },
            { label: "Data Backup", status: "Pending Fix", icon: HardDrive, color: "#F59E0B" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                  <item.icon className="h-4 w-4" style={{ color: item.color }} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </article>

      {/* Pillar 10: Document Performance */}
      <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 transition-all hover:border-[var(--primary)]/30">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Performance</h2>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between group">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Clearance Time</p>
            <div className="text-right">
              <span className="text-lg font-black text-slate-800 dark:text-white">5 mins</span>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Highly Efficient</p>
            </div>
          </div>
          <div className="flex items-center justify-between group">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Request</p>
            <div className="text-right">
              <span className="text-sm font-black text-slate-800 dark:text-white">Residency Certificate</span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">42% of volume</p>
            </div>
          </div>
        </div>
      </article>

      {/* Pillar 7: Barangay Info Card (Improved) */}
      <article className="group relative overflow-hidden rounded-3xl border-none bg-[var(--primary)] p-7 text-white shadow-xl shadow-[var(--primary)]/20">
        <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 opacity-10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
          <Landmark className="h-40 w-40" />
        </div>
        
        {/* Glow Effect */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white opacity-10 blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-xl ring-1 ring-white/30">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 leading-none mb-1.5">Official Summary</p>
                <h2 className="text-2xl font-black tracking-tight leading-none">Brgy. Salaza</h2>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 ring-1 ring-emerald-500/30 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">3 Active Users</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 border-t border-white/20 pt-7">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 opacity-60">
                <Landmark className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Captain</span>
              </div>
              <p className="text-base font-black tracking-tight">Hon. P. Seitz</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 opacity-60">
                <UsersIcon className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Households</span>
              </div>
              <p className="text-base font-black tracking-tight">2,420</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
