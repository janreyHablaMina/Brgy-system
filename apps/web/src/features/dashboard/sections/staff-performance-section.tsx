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
    <WidgetCard
      title="Staff Performance (This Month)"
      className="rounded-xl border-slate-200 bg-white p-0"
      headerClassName="px-5 pt-5 pb-4"
    >
      <div className="grid gap-0 px-3 pb-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="px-2 py-2 sm:px-3 xl:border-r xl:border-slate-200 xl:last:border-r-0"
          >
            <div className="mb-3 flex items-center gap-2.5">
              {item.avatarUrl ? (
                <Image
                  src={item.avatarUrl}
                  alt={item.name}
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div
                  className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${avatarColors[i % avatarColors.length]}`}
                >
                  {getInitials(item.name)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-slate-800">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-500">{item.role}</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-[32px] font-bold leading-none tracking-tight text-slate-900">
                {item.processed}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Documents Processed</p>
            </div>

            <div className="flex items-center gap-2.5">
              <ProgressBar
                value={item.completion}
                color={item.barColor}
                size="sm"
                className="flex-1"
                trackClassName="bg-slate-200"
              />
              <p className="text-[12px] font-semibold text-slate-600">{item.completion}%</p>
            </div>
          </article>
        ))}
      </div>
    </WidgetCard>
  );
}
