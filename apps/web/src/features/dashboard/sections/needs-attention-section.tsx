import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardAttentionItem } from "@/features/dashboard/types";

type NeedsAttentionSectionProps = {
  items: DashboardAttentionItem[];
};

const toneConfig = {
  warning: {
    bg: "bg-amber-50/40 dark:bg-amber-500/6",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    border: "border-[var(--border)]/55",
    cta: "text-amber-700 dark:text-amber-400 hover:opacity-80",
  },
  danger: {
    bg: "bg-rose-50/40 dark:bg-rose-500/6",
    icon: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    border: "border-[var(--border)]/55",
    cta: "text-rose-700 dark:text-rose-400 hover:opacity-80",
  },
  accent: {
    bg: "bg-amber-50/35 dark:bg-amber-500/6",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    border: "border-[var(--border)]/55",
    cta: "text-amber-700 dark:text-amber-400 hover:opacity-80",
  },
};

export function NeedsAttentionSection({ items }: NeedsAttentionSectionProps) {
  return (
    <WidgetCard
      title="Needs Attention"
      action={
        <button className="text-xs font-semibold text-[var(--primary)] hover:underline">
          View all
        </button>
      }
    >
      <div className="space-y-2.5">
        {items.map((item) => {
          const cfg = toneConfig[item.tone];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 shadow-none",
                cfg.bg,
                cfg.border
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", cfg.icon)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{item.label}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{item.detail}</p>
                </div>
              </div>

              <button
                suppressHydrationWarning
                className={cn(
                  "group/cta inline-flex shrink-0 items-center gap-1 text-xs font-semibold transition",
                  cfg.cta
                )}
              >
                <span>{item.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
