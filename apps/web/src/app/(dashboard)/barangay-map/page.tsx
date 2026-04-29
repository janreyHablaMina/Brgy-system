import { BarangayMapPage } from "@/features/barangay-map/components/barangay-map-page";

export const metadata = {
  title: "Barangay Map | Barangay Management System",
  description: "Visualize resident locations through static map pin mapping.",
};

export default function DashboardBarangayMapPage() {
  return <BarangayMapPage />;
}
