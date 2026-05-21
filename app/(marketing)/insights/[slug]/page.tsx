import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Article" };

// Next 16: params is async (§Async Request APIs).
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title="Insights article"
      current="Insights"
      note={`Article template (/insights/${slug}). Design TBC per §17 open items. Built in the Marketing-pages stage.`}
    />
  );
}
