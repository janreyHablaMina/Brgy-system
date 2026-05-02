import Link from "next/link";
import dynamic from "next/dynamic";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardOverviewData } from "@/features/dashboard/types";

const MapInner = dynamic(() => import("../components/map-inner"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-xs font-medium text-slate-400">
      Loading realistic map...
    </div>
  )
});

type ResidentsMapSectionProps = {
  cluster: DashboardOverviewData["mapCluster"];
  tenantName: string;
};

export function ResidentsMapSection({ cluster, tenantName }: ResidentsMapSectionProps) {
  return (
    <WidgetCard
      title={`${tenantName} Map`}
      action={
        <Link
          href="/barangay-map"
          className="text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View Full Map
        </Link>
      }
    >
      <div className="relative h-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-[#edf1f4]">
        <MapInner cluster={cluster} />
      </div>
    </WidgetCard>
  );
}
