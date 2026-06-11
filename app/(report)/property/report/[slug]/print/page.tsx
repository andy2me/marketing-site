import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTIONS } from "@/lib/report/types";
import { getReport, getReportSlugs } from "@/lib/report/store";
import { SectionView } from "@/components/report/sections";
import { AutoPrint } from "@/components/report/AutoPrint";
import s from "@/components/report/print.module.css";

// Printable proposal — all 8 sections stacked, no shell chrome, auto-print on load.
// Reached via the "Download as PDF" action in Next steps. Static segment beats [section].
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getReportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  title: "Proposal · printable",
  robots: { index: false, follow: false },
};

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) notFound();
  return (
    <div className={s.printRoot}>
      <AutoPrint />
      {SECTIONS.map((sec) => (
        <section key={sec.id} className={s.printSection}>
          <SectionView id={sec.id} report={report} />
        </section>
      ))}
    </div>
  );
}
