import { redirect } from "next/navigation";
import { getReportSlugs } from "@/lib/report/store";

// Base report URL loads the first section once the gate is cleared (design handoff §URL).
export async function generateStaticParams() {
  const slugs = await getReportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ReportIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/property/report/${slug}/welcome`);
}
