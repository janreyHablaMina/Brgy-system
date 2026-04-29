import { DrrmManagementPage } from "@/features/drrm/components/drrm-management-page";

export const metadata = {
  title: "Disaster & Emergency Management | Barangay Management System",
  description: "Manage evacuation events, hazard areas, and evacuee family monitoring.",
};

export default function DashboardDrrmPage() {
  return <DrrmManagementPage />;
}
