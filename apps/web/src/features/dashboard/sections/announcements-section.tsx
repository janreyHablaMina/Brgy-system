import { StatusBadge } from "@/components/ui/status-badge";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardAnnouncementItem } from "@/features/dashboard/types";

type AnnouncementsSectionProps = {
  items: DashboardAnnouncementItem[];
};

export function AnnouncementsSection({ items }: AnnouncementsSectionProps) {
  return (
    <WidgetCard
      title="Announcements"
      noPadding
      headerClassName="px-3.5 pt-3 pb-2"
      action={
        <button className="text-xs font-semibold text-[var(--primary)] hover:underline">
          View all
        </button>
      }
    >
      <div className="space-y-2 px-3.5 pb-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3"
            >
              <div className="mb-1.5 flex items-start gap-2">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[var(--text)] leading-tight">
                      {item.title}
                    </p>
                    {item.isNew && <StatusBadge label="New" tone="new" />}
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[var(--muted)]">
                    {item.schedule}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">{item.note}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </WidgetCard>
  );
}
