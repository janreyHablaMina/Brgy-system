import Image from "next/image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardStaffItem } from "@/features/dashboard/types";

type StaffPerformanceSectionProps = {
  items: DashboardStaffItem[];
};

const avatarColors = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function StaffPerformanceSection({ items }: StaffPerformanceSectionProps) {
  return (
    <WidgetCard title="Staff Performance (This Month)">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3"
          >
            {/* Staff info */}
            <div className="mb-3 flex items-center gap-2.5">
              {item.avatarUrl ? (
                <Image
                  src={item.avatarUrl}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarColors[i % avatarColors.length]}`}
                >
                  {getInitials(item.name)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--text)] leading-tight">
                  {item.name}
                </p>
                <p className="text-[11px] text-[var(--muted)]">{item.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-2">
              <p className="text-2xl font-extrabold text-[var(--text)] leading-none">
                {item.processed}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">Documents Processed</p>
            </div>

            {/* Progress bar */}
            <ProgressBar
              value={item.completion}
              color={item.barColor}
              size="sm"
            />
            <p className="mt-1 text-right text-[10px] font-semibold text-[var(--muted)]">
              {item.completion}%
            </p>
          </article>
        ))}
      </div>
    </WidgetCard>
  );
}
