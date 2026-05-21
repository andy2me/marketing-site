import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Privacy Policy" };
export const revalidate = 86400; // daily (§6)

export default function PrivacyPage() {
  return (
    <PagePlaceholder
      title="Privacy Policy"
      note="Legal content from WordPress. Built in the Marketing-pages / Content stage."
    />
  );
}
