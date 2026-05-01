import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardActivityItem } from "@/features/dashboard/types";

type RecentActivitySectionProps = {
  items: DashboardActivityItem[];
};

const toneConfig = {
  success: {
    bg: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    text: "text-white",
  },
  info: {
    bg: "bg-blue-500",
    ring: "ring-blue-500/20",
    text: "text-white",
  },
  warning: {
    bg: "bg-amber-500",
    ring: "ring-amber-500/20",
    text: "text-white",
  },
  accent: {
    bg: "bg-violet-500",
    ring: "ring-violet-500/20",
    text: "text-white",
  },
};

export function RecentActivitySection({ items }: RecentActivitySectionProps) {
  const visibleItems = items.slice(0, 4);

  return (
    <WidgetCard
      title="Recent Activity"
      action={
        <button className="text-xs font-semibold text-[var(--primary)] hover:underline">
          View all
        </button>
      }
    >
      <div className="space-y-2.5">
        {visibleItems.map((item) => {
          const cfg = toneConfig[item.tone];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-2.5"
            >
              {/* Icon dot */}
              <div
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4",
                  cfg.bg,
                  cfg.ring
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", cfg.text)} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--text)]">
                  {item.label}
                </p>
                <p className="truncate text-[11px] text-[var(--muted)]">{item.detail}</p>
                <p className="mt-0.5 text-[10px] font-medium text-[var(--muted)]/70">
                  {item.at}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
