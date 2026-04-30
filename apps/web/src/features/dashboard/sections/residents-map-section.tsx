import Link from "next/link";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardOverviewData } from "@/features/dashboard/types";

type ResidentsMapSectionProps = {
  cluster: DashboardOverviewData["mapCluster"];
};

export function ResidentsMapSection({ cluster }: ResidentsMapSectionProps) {
  return (
    <WidgetCard
      title="Residents Map"
      action={
        <Link
          href="/barangay-map"
          className="text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View Full Map
        </Link>
      }
    >
      {/* Map placeholder with grid lines and cluster bubbles */}
      <div className="relative h-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[radial-gradient(circle_at_40%_50%,#d8e8f8_0%,#e8f0f9_50%,#eef3fb_100%)] dark:bg-[radial-gradient(circle_at_40%_50%,#1e2d40_0%,#1a2535_60%,#151e2e_100%)]">
        {/* Grid lines */}
        <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400 dark:text-slate-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>

        {/* Road-like lines */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="55%" x2="100%" y2="48%" stroke="#94a3b8" strokeWidth="3" opacity="0.3" />
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#94a3b8" strokeWidth="2.5" opacity="0.25" />
          <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2" opacity="0.2" />
        </svg>

        {/* Cluster bubbles */}
        <span className="absolute left-[18%] top-[20%] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-lg shadow-emerald-500/30">
          {cluster.green}
        </span>
        <span className="absolute left-[52%] top-[38%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-lg shadow-amber-500/30">
          {cluster.amber}
        </span>
        <span className="absolute left-[36%] top-[60%] flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-lg shadow-blue-500/30">
          {cluster.blue}
        </span>
        <span className="absolute left-[72%] top-[25%] flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-lg shadow-rose-500/30">
          {cluster.red}
        </span>

        {/* Map pin icons */}
        <svg className="absolute left-[22%] top-[32%] h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <svg className="absolute left-[56%] top-[50%] h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <svg className="absolute left-[40%] top-[72%] h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
    </WidgetCard>
  );
}
