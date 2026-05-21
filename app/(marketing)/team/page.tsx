import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Team — Agents & Leadership" };

export default function TeamPage() {
  return (
    <PagePlaceholder
      title="Team"
      current="Team"
      note="Leadership cards, support row, culture band, careers (§7 agent CPT). Built in the Marketing-pages stage."
    />
  );
}
