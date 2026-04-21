import {
  ActivityFeed,
  Announcements,
  NeedsAttention,
  RecentRequests,
  StaffActivity,
  SummaryCards,
  TodaySnapshot,
  UpcomingSchedule,
} from "@/features/dashboard/components";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-4">
      {/* Hero / Greeting */}
      <section className="px-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-normal text-[var(--muted)]">
              Good morning,{" "}
              <span className="font-medium text-[var(--primary)]">Pauline Seitz!</span>{" "}
              {"\u{1F44B}"}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Barangay Operations
            </h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Real-time overview of residents, requests, and operations.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
                </span>
                <span className="font-display text-lg font-bold leading-none tracking-tight text-[var(--text)]">
                  10:16 AM
                </span>
              </div>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                Tuesday, April 21, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <SummaryCards />

      {/* Main Content Grid */}
      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <NeedsAttention />

          <div className="grid gap-4 lg:grid-cols-2">
            <RecentRequests />
            <StaffActivity />
          </div>

          <ActivityFeed />
        </div>

        <aside className="space-y-4">
          <Announcements />
          <TodaySnapshot />
          <UpcomingSchedule />
        </aside>
      </section>
    </div>
  );
}
