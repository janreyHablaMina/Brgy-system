import Link from "next/link";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardActionItem } from "@/features/dashboard/types";

type QuickActionsSectionProps = {
  items: DashboardActionItem[];
};

export function QuickActionsSection({ items }: QuickActionsSectionProps) {
  return (
    <WidgetCard title="Quick Actions">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          const content = (
            <div className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 text-center shadow-none transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 hover:shadow-none">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110"
                style={{ backgroundColor: item.iconBg }}
              >
                <Icon className="h-5 w-5" style={{ color: item.iconColor }} />
              </div>
              <span className="text-[11px] font-semibold leading-tight text-[var(--text)] group-hover:text-[var(--primary)]">
                {item.label}
              </span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            );
          }

          return (
            <button key={item.id} type="button" className="block w-full text-left">
              {content}
            </button>
          );
        })}
      </div>
    </WidgetCard>
  );
}
