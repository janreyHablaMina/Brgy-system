import { BlotterRecordsManagementPage } from "@/features/blotter-records/components/blotter-records-management-page";

export const metadata = {
  title: "Blotter Records | Barangay Management System",
  description: "Manage blotter entries, incident documentation, and follow-up actions.",
};

export default function BlotterRecordsPage() {
  return <BlotterRecordsManagementPage />;
}
