import { EmailDashboardPage } from "@/features/email/components/email-dashboard-page";

export const metadata = {
  title: "Email | Barangay Management System",
  description: "Manage incoming and outgoing official barangay email messages.",
};

export default function EmailPage() {
  return <EmailDashboardPage />;
}
