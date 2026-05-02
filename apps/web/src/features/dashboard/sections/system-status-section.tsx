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
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-2 px-3 pb-4">
        {items.map((item) => {
          const isSuccess = item.tone === 'success';
          const ServiceIcon = item.icon;

          return (
            <div
              key={item.id}
              className="group flex flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-2 transition-all hover:bg-[var(--card)] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg shadow-sm",
                  isSuccess ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                )}>
                  <ServiceIcon className="h-4 w-4" />
                </div>
                <div className="relative flex h-1.5 w-1.5">
                  <span className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    isSuccess ? "bg-emerald-400" : "bg-amber-400"
                  )}></span>
                  <span className={cn(
                    "relative inline-flex h-1.5 w-1.5 rounded-full",
                    isSuccess ? "bg-emerald-500" : "bg-amber-500"
                  )}></span>
                </div>
              </div>

              <div>
                <p className="truncate text-[10px] font-bold uppercase tracking-tight text-slate-400">
                  {item.name}
                </p>
                <p className={cn(
                  "truncate text-[11px] font-bold",
                  isSuccess ? "text-emerald-600" : "text-amber-600"
                )}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
