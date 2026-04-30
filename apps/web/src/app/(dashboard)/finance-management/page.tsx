import { FinanceManagementPage } from "@/features/finance-management/components/finance-management-page";

export const metadata = {
  title: "Finance Management | Barangay Management System",
  description: "Manage budgets, disbursements, cashbook entries, and collections.",
};

export default function DashboardFinanceManagementPage() {
  return <FinanceManagementPage />;
}
