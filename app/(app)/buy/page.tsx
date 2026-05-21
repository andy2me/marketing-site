import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Properties for Sale — Sunshine Coast" };
export const revalidate = 900; // 10–15 min + on Rex webhook (§8)

export default function BuyPage() {
  return (
    <PagePlaceholder
      title="Properties"
      current="Buy"
      note="Listings index — sticky filter bar, grid/map toggle, MapLibre, card↔pin hover sync, URL-synced state (§8). Built in the Listings stage."
    />
  );
}
