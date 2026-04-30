import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardStatusItem } from "@/features/dashboard/types";

type SystemStatusSectionProps = {
  items: DashboardStatusItem[];
};

const toneConfig = {
  success: {
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  warning: {
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    icon: AlertTriangle,
  },
  danger: {
    badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

export function SystemStatusSection({ items }: SystemStatusSectionProps) {
  return (
    <WidgetCard title="System Status">
      <div className="space-y-2">
        {items.map((item) => {
          const cfg = toneConfig[item.tone];
          const ServiceIcon = item.icon;
          const StatusIcon = cfg.icon;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2.5"
            >
              {/* Left: icon + name */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--border)] text-[var(--muted)]">
                  <ServiceIcon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[13px] font-semibold text-[var(--text)]">{item.name}</p>
              </div>

              {/* Right: status badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                  cfg.badge
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
