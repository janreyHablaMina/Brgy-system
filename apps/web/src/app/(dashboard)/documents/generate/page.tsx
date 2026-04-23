import { DocumentGenerationPage } from "@/features/documents/components/document-generation-page";

export const metadata = {
  title: "Generate Document | Barangay Management System",
  description: "Generate and preview official barangay documents.",
};

export default function Page() {
  return <DocumentGenerationPage />;
}
