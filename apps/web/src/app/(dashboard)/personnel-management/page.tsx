import { PersonnelManagementPage } from "@/features/personnel-management/components/personnel-management-page";

export const metadata = {
  title: "Personnel Management | Barangay Management System",
  description: "Manage officials, staff, and personnel records through the internal HRIS module.",
};

export default function DashboardPersonnelManagementPage() {
  return <PersonnelManagementPage />;
}
