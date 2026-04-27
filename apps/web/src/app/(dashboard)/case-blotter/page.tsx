import { CaseBlotterManagementPage } from "@/features/case-blotter/components/case-blotter-management-page";

export const metadata = {
  title: "Case / Blotter | Barangay Management System",
  description: "Manage blotter incidents, mediation records, and case statuses.",
};

export default function CaseBlotterPage() {
  return <CaseBlotterManagementPage />;
}
