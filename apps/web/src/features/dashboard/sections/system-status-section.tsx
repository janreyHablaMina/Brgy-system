import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardStatusItem } from "@/features/dashboard/types";

type SystemStatusSectionProps = {
  items: DashboardStatusItem[];
};

const toneConfig = {
  success: {
    badge: "text-emerald-500",
    icon: CheckCircle,
  },
  warning: {
    badge: "text-amber-500",
    icon: AlertTriangle,
  },
  danger: {
    badge: "text-rose-500",
    icon: XCircle,
  },
};

export function SystemStatusSection({ items }: SystemStatusSectionProps) {
  return (
    <WidgetCard
      title="System Status"
      className="h-full rounded-xl border-slate-200 bg-white p-0"
      headerClassName="px-3.5 pt-3 pb-2"
    >
      <div className="flex h-full flex-col justify-between px-3.5 pb-2">
        {items.map((item) => {
          const cfg = toneConfig[item.tone];
          const ServiceIcon = item.icon;
          const StatusIcon = cfg.icon;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center text-slate-500">
                  <ServiceIcon className="h-4 w-4" />
                </div>
                <p className="text-[15px] font-semibold text-slate-800">{item.name}</p>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-semibold",
                  cfg.badge
                )}
              >
                <span>{item.value}</span>
                <StatusIcon className="h-4.5 w-4.5" />
              </span>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
