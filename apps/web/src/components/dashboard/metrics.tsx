"use client";

import { Users, FileText, Wallet, Heart, Vote, Home, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Total Residents",
    value: "12,842",
    delta: "+4.2%",
    icon: Users,
    positive: true,
    color: "var(--primary)",
  },
  {
    label: "Total Households",
    value: "2,420",
    delta: "+1.1%",
    icon: Home,
    positive: true,
    color: "#6366F1",
  },
  {
    label: "Registered Voters",
    value: "8,420",
    delta: "+3.5%",
    icon: Vote,
    positive: true,
    color: "#3B82F6",
  },
  {
    label: "Pending Documents",
    value: "126",
    delta: "-1.8%",
    icon: FileText,
    positive: false,
    color: "#F59E0B",
  },
  {
    label: "Monthly Collections",
    value: "PHP 284.5K",
    delta: "+7.4%",
    icon: Wallet,
    positive: true,
    color: "#10B981",
  },
  {
    label: "Seniors / PWD",
    value: "1,420",
    delta: "+2.1%",
    icon: Heart,
    positive: true,
    color: "#EC4899",
  },
];

export function DashboardMetrics() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 dark:border-slate-800/70 dark:bg-slate-900 md:px-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Key Metrics
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-0">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={metric.label}
              className="group relative rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 md:rounded-none md:border-l md:border-slate-100 md:px-4 md:first:border-l-0 dark:md:border-slate-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                  style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    metric.positive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}
                >
                  {metric.delta}
                  <TrendIcon className="h-3 w-3" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  {metric.label}
                </h3>
                <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
