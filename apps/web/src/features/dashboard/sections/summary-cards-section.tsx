import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/features/dashboard/types";

type SummaryCardsSectionProps = {
  items: DashboardSummary[];
};

const toneConfig = {
  success: { delta: "text-emerald-600 dark:text-emerald-400", icon: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" },
  warning: { delta: "text-amber-600 dark:text-amber-400", icon: "bg-amber-50 dark:bg-amber-500/10 text-amber-500" },
  danger: { delta: "text-rose-600 dark:text-rose-400", icon: "bg-rose-50 dark:bg-rose-500/10 text-rose-500" },
  neutral: { delta: "text-slate-500 dark:text-slate-400", icon: "bg-slate-100 dark:bg-slate-700 text-slate-500" },
};

export function SummaryCardsSection({ items }: SummaryCardsSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const cfg = toneConfig[item.tone];
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:shadow-md"
          >
            {/* Icon */}
            <div className={cn("mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl", cfg.icon)}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Label */}
            <p className="text-[13px] font-medium text-[var(--muted)]">{item.label}</p>

            {/* Value */}
            <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-[var(--text)]">
              {item.value}
            </p>

            {/* Delta */}
            <p className={cn("mt-1.5 text-[12px] font-semibold", cfg.delta)}>
              {item.delta}
            </p>
          </article>
        );
      })}
    </div>
  );
}
