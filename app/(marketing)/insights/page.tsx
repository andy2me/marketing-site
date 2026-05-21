import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Insights — Market Notes & Journal" };

export const revalidate = 1800; // 30 min + on WP publish (§6)

export default function InsightsPage() {
  return (
    <PagePlaceholder
      title="Insights"
      current="Insights"
      note="Editorial index — featured, category chip bar, grid, newsletter (§7). Built in the Marketing-pages stage."
    />
  );
}
