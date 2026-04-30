import { TanodManagementPage } from "@/features/tanod-management/components/tanod-management-page";

export const metadata = {
  title: "Tanod Management | Barangay Management System",
  description: "Manage tanod members, schedules, patrol logs, and incident reports.",
};

export default function DashboardTanodManagementPage() {
  return <TanodManagementPage />;
}
