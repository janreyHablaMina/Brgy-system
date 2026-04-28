import { CaseRecordsManagementPage } from "@/features/case-records/components/case-records-management-page";

export const metadata = {
  title: "Case Records | Barangay Management System",
  description: "Manage formal case records, investigation progress, and resolutions.",
};

export default function CaseRecordsPage() {
  return <CaseRecordsManagementPage />;
}
