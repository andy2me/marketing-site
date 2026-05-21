import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Terms" };
export const revalidate = 86400; // daily (§6)

export default function TermsPage() {
  return (
    <PagePlaceholder
      title="Terms"
      note="Legal content from WordPress. Built in the Marketing-pages / Content stage."
    />
  );
}
