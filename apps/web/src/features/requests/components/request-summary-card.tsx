"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";

interface RequestSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "amber" | "blue" | "emerald" | "rose" | "indigo" | "violet" | "sky";
  viewAllText?: string;
  onClick?: () => void;
}

export function RequestSummaryCard({
  icon: Icon,
  label,
  value,
  tone,
  viewAllText,
  onClick,
}: RequestSummaryCardProps) {
  const tones = {
    amber: "border-amber-300/30 bg-amber-500/5 text-amber-600 before:bg-amber-400 icon:bg-amber-50",
    blue: "border-blue-300/30 bg-blue-500/5 text-blue-600 before:bg-blue-400 icon:bg-blue-50",
    rose: "border-rose-300/30 bg-rose-500/5 text-rose-600 before:bg-rose-400 icon:bg-rose-50",
    indigo: "border-indigo-300/30 bg-indigo-500/5 text-indigo-600 before:bg-indigo-400 icon:bg-indigo-50",
    violet: "border-violet-300/30 bg-violet-500/5 text-violet-600 before:bg-violet-400 icon:bg-violet-50",
    sky: "border-sky-300/30 bg-sky-500/5 text-sky-600 before:bg-sky-400 icon:bg-sky-50",
    emerald: "border-emerald-300/30 bg-emerald-500/5 text-emerald-600 before:bg-emerald-400 icon:bg-emerald-50",
  };

  const activeTone = tones[tone];
  const [borderClass, bgClass, textClass, stripeClass, iconBgClass] = activeTone.split(" ");

  return (
    <article 
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 transition-all duration-300 cursor-pointer group",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1 hover:before:w-1.5 before:transition-all",
        stripeClass.replace("before:", "before:")
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
        </div>
        <div className={cn(
          "rounded-xl p-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconBgClass.replace("icon:", ""), 
          textClass
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {viewAllText && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 transition-colors group-hover:text-[var(--primary)]">
            {viewAllText}
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:translate-x-1">
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </article>
  );
}
