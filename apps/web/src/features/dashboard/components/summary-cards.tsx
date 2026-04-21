"use client";

import {
  Clock3,
  FileBadge,
  Scale,
  ShieldCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    label: "Queue Health",
    value: "Stable",
    note: "All systems normal",
    icon: ShieldCheck,
    color: "emerald",
    isLive: true,
  },
  {
    label: "Priority Cases",
    value: "3",
    note: "Requires attention",
    icon: Scale,
    color: "amber",
    isLive: false,
  },
  {
    label: "Staff Online",
    value: "3",
    note: "Active now",
    icon: Users,
    color: "blue",
    isLive: true,
  },
  {
    label: "Avg Turnaround",
    value: "5m",
    note: "This week",
    icon: Clock3,
    color: "violet",
    isLive: false,
  },
  {
    label: "Documents Today",
    value: "12",
    note: "Compared to yesterday",
    trend: "+20%",
    icon: FileBadge,
    color: "cyan",
    isLive: false,
  },
];

const colorStyles: Record<string, string> = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 glow-emerald-500/20",
  amber: "text-amber-600 bg-amber-50 border-amber-100 glow-amber-500/20",
  blue: "text-indigo-600 bg-indigo-50 border-indigo-100 glow-indigo-500/20",
  violet: "text-violet-600 bg-violet-50 border-violet-100 glow-violet-500/20",
  cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 glow-cyan-500/20",
};

export function SummaryCards() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const style = colorStyles[card.color];

        return (
          <article
            key={card.label}
            className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)]/40 hover:shadow-lg"
          >
            {/* Header: Icon + Pulse/Trend */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-110",
                  style.split(" ").slice(0, 3).join(" ")
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {card.isLive ? (
                <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-2 py-0.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", 
                    card.color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'
                  )} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">Live</span>
                </div>
              ) : card.trend ? (
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </div>
              ) : null}
            </div>

            {/* Label */}
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {card.label}
            </p>

            {/* Value (Outfit Font) */}
            <p className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--primary)]">
              {card.value}
            </p>

            {/* Note */}
            <p className="mt-1.5 text-xs font-medium leading-tight text-[var(--muted)]">
              {card.note}
            </p>

            {/* Subtle background glow effect (optional refinement) */}
            <div className={cn(
              "absolute -right-4 -top-4 h-16 w-16 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]",
              card.color === 'emerald' ? 'bg-emerald-500' : 
              card.color === 'amber' ? 'bg-amber-500' : 
              card.color === 'blue' ? 'bg-indigo-500' : 
              card.color === 'violet' ? 'bg-violet-500' : 'bg-cyan-500',
              "rounded-full blur-2xl"
            )} />
          </article>
        );
      })}
    </section>
  );
}
