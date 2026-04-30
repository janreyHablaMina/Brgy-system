import Link from "next/link";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardAttentionItem } from "@/features/dashboard/types";

type NeedsAttentionSectionProps = {
  items: DashboardAttentionItem[];
};

const toneConfig = {
  warning: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-500/20",
    cta: "border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
  },
  danger: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    icon: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    border: "border-rose-200/60 dark:border-rose-500/20",
    cta: "border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10",
  },
  accent: {
    bg: "bg-amber-50/60 dark:bg-amber-500/10",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-500/20",
    cta: "border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
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
                "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5",
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
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1 text-xs font-semibold transition",
                  cfg.cta
                )}
              >
                {item.cta}
              </button>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
