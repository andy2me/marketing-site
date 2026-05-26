import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ReportFrame } from "@/components/report/ReportFrame";
import { getReport } from "@/lib/report/store";

// Report register: gated, chrome-less, app-like (no marketing header/footer). The frame holds
// the email gate + shell; the [section] page below supplies the active section as children.
export default async function ReportLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) notFound();

  return <ReportFrame report={report}>{children}</ReportFrame>;
}
