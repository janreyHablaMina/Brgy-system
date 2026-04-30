import { SystemSettingsPage } from "@/features/system-settings/components/system-settings-page";

export const metadata = {
  title: "System Settings | Barangay Management System",
  description: "Manage barangay configuration, branding, fees, templates, and notification preferences.",
};

export default function SettingsPage() {
  return <SystemSettingsPage />;
}
