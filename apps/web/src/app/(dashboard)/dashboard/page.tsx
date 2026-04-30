"use client";

import { DashboardOverview } from "@/features/dashboard/widgets/dashboard-overview";
import { getDashboardOverviewData } from "@/features/dashboard/data";
import { useTenant } from "@/core/tenant/tenant-provider";

export default function DashboardPage() {
  const { tenant } = useTenant();
  const data = getDashboardOverviewData(tenant.id, tenant.displayName);

  return <DashboardOverview data={data} />;
}
