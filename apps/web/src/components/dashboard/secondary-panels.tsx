"use client";

import { Activity, ShieldCheck, Database, HardDrive, Info, Landmark, Users } from "lucide-react";

export function SecondaryPanels() {
  return (
    <div className="space-y-6">
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

      {/* Pillar 7: Barangay Info Card */}
      <article className="group relative overflow-hidden rounded-2xl border-none bg-[var(--primary)] p-6 text-white">
        <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 opacity-10 transition-transform group-hover:scale-110">
          <Landmark className="h-32 w-32" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-md">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 leading-none mb-1">Local Identity</p>
              <h2 className="text-xl font-black leading-none">Brgy. Salaza</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 opacity-70">
                <Landmark className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase">Captain</span>
              </div>
              <p className="text-sm font-black">Hon. P. Seitz</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 opacity-70">
                <Users className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase">Households</span>
              </div>
              <p className="text-sm font-black">2,420</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
