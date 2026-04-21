"use client";

import { Megaphone, AlertTriangle, ChevronRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const news = [
  { 
    title: "Community Clean-up Drive", 
    date: "This Saturday, 8:00 AM", 
    type: "announcement",
    tag: "Community"
  },
  { 
    title: "Server Maintenance Notice", 
    date: "Starts in 2 hours", 
    type: "system",
    priority: true,
    tag: "System"
  }
];

export function Announcements() {
  return (
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200">
          <Megaphone className="h-5 w-5 text-slate-400" />
          Bulletin Board
        </h2>
        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      </div>

      <div className="p-4 space-y-4">
        {news.map((item, idx) => (
          <div 
            key={idx} 
            className="group relative rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 p-4 transition-all hover:border-[var(--primary)]/30"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  item.type === "system" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-[var(--primary)]/10 text-[var(--primary)]"
                )}>
                  {item.type === "system" ? <Terminal className="h-4 w-4" /> : <Megaphone className="h-4 w-4" />}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {item.tag}
                </span>
              </div>
              {item.priority && (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-red-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Urgent
                </span>
              )}
            </div>
            
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[var(--primary)] transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {item.date}
            </p>
          </div>
        ))}

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]">
          Manage Bulletin
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}
