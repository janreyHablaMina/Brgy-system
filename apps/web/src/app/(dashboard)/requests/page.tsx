import { RequestsManagementPage } from "@/features/requests/components/requests-management-page";

export const metadata = {
  title: "Requests Management | Barangay Management System",
  description: "Monitor and process service requests from residents and establishments.",
};

export default function RequestsPage() {
  return <RequestsManagementPage />;
}
