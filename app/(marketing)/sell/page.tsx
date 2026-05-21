import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Sell — Request an Appraisal" };

export default function SellPage() {
  return (
    <PagePlaceholder
      title="Sell"
      current="Sell"
      note="Vendor-acquisition page (process, results, included, FAQ) plus the Doorstep appraisal form at #appraisal (§9). Built in the Forms + Marketing-pages stages."
    />
  );
}
