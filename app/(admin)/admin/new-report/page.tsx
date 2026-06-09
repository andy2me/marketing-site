import type { Metadata } from "next";
import { ReportComposer } from "@/components/admin/ReportComposer";

export const metadata: Metadata = {
  title: "Compose appraisal report",
  robots: { index: false, follow: false },
};

export default function NewReportPage() {
  return <ReportComposer />;
}
