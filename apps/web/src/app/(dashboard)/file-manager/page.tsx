import { FileManagerPage } from "@/features/file-manager/components/file-manager-page";

export const metadata = {
  title: "File Manager | Barangay Management System",
  description: "Centralized storage and organization of barangay files and folders.",
};

export default function DashboardFileManagerPage() {
  return <FileManagerPage />;
}
