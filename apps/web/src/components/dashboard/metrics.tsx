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
    value: "₱284.5K",
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.positive ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 active:scale-[0.98]"
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.03] transition-opacity group-hover:opacity-[0.08]" 
              style={{ backgroundColor: metric.color }}
            />

            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                metric.positive 
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
              )}>
                {metric.delta}
                <TrendIcon className="h-3 w-3" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</h3>
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metric.value}
              </p>
            </div>

            {/* Micro-Interaction Indicator */}
            <div 
              className="absolute bottom-0 left-0 h-1 w-0 bg-current transition-all duration-500 group-hover:w-full"
              style={{ color: metric.color }}
            />
          </div>
        );
      })}
    </div>
  );
}
