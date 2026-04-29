import { AuditLogsPage } from "@/features/audit-logs/components/audit-logs-page";

export const metadata = {
  title: "Audit Logs | Barangay Management System",
  description: "Admin monitoring of user activity logs for security, transparency, and accountability.",
};

export default function SystemAuditLogsPage() {
  return <AuditLogsPage />;
}
