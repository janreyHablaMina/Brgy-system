import Image from "next/image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardStaffItem } from "@/features/dashboard/types";

type StaffPerformanceSectionProps = {
  items: DashboardStaffItem[];
};

export function StaffPerformanceSection({ items }: StaffPerformanceSectionProps) {
  return (
    <WidgetCard
      title="Staff Performance (This Month)"
      className="h-full"
    >
      <div className="grid h-full gap-0 px-3 pb-4 sm:grid-cols-2 xl:grid-cols-4 content-center">
        {items.map((item) => (
          <article
            key={item.id}
            className="px-2 py-2 sm:px-3 xl:border-r xl:border-[var(--border)] xl:last:border-r-0"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <Image
                src={item.avatarUrl ?? "/avatar.png"}
                alt={item.name}
                width={42}
                height={42}
                className="h-[42px] w-[42px] rounded-full border border-[var(--border)] object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-[var(--text)]">
                  {item.name}
                </p>
                <p className="text-[11px] text-[var(--muted)]">{item.role}</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-[32px] font-bold leading-none tracking-tight text-[var(--text)]">
                {item.processed}
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">Documents Processed</p>
            </div>

            <div className="flex items-center gap-2.5">
              <ProgressBar
                value={item.completion}
                color={item.barColor}
                size="sm"
                className="flex-1"
                trackClassName="bg-slate-200 dark:bg-slate-800"
              />
              <p className="text-[12px] font-semibold text-[var(--muted)]">{item.completion}%</p>
            </div>
          </article>
        ))}
      </div>
    </WidgetCard>
  );
}
