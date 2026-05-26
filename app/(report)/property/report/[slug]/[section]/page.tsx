import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTIONS, sectionByRoute } from "@/lib/report/types";
import { getReport, getReportSlugs } from "@/lib/report/store";
import { SectionView } from "@/components/report/sections";

// Each section is its own route so engagement maps to pageviews (design handoff §URL). ISR;
// regeneration keeps the slug stable (open question #4). Reports are private — never indexed.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getReportSlugs();
  return slugs.flatMap((slug) => SECTIONS.map((s) => ({ slug, section: s.route })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}): Promise<Metadata> {
  const { slug, section } = await params;
  const report = await getReport(slug);
  const resolved = sectionByRoute(section);
  if (!report || !resolved) return { title: "Appraisal", robots: { index: false, follow: false } };
  const title = `${report.property.street} — ${resolved.def.long}`;
  return {
    title,
    description: `A private vendor appraisal prepared for ${report.vendor.fullName} by Max Property.`,
    // Private vendor artefacts: never indexed (the gate would block crawlers regardless).
    robots: { index: false, follow: false },
    openGraph: {
      title: `An appraisal prepared for ${report.vendor.fullName}`,
      description: `${report.property.street}, ${report.property.suburb} · Max Property`,
    },
  };
}

export default async function ReportSectionPage({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;
  const [report, resolved] = [await getReport(slug), sectionByRoute(section)];
  if (!report || !resolved) notFound();

  return <SectionView id={resolved.def.id} report={report} />;
}
