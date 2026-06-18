// Agent profile route — /team/{slug}/
// Server component. Fetches the agent record, then filters listings/reviews/articles
// in parallel by agent.id (no per-agent store APIs needed yet — see plan §2).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/wp/mock";
import { getAgent, getAgentSlugs } from "@/lib/agents/store";
import { getActiveListings, getSoldListings } from "@/lib/rex";
import { getReviews } from "@/lib/reviews/mock";
import { listCards } from "@/lib/insights/store";
import { AgentHero } from "@/components/agent/AgentHero";
import { AgentBio } from "@/components/agent/AgentBio";
import { AgentSuburbs } from "@/components/agent/AgentSuburbs";
import { AgentVideos } from "@/components/agent/AgentVideos";
import { AgentListings } from "@/components/agent/AgentListings";
import { AgentTestimonials } from "@/components/agent/AgentTestimonials";
import { AgentContent } from "@/components/agent/AgentContent";
import { ContactCard } from "@/components/agent/ContactCard";
import { AgentFooterCta } from "@/components/agent/AgentFooterCta";
import s from "@/components/agent/agent.module.css";

export async function generateStaticParams() {
  const slugs = await getAgentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) return { title: "Agent not found" };
  return {
    title: `${agent.name} — Max Property`,
    description: agent.positioning,
    alternates: { canonical: `/team/${slug}` },
  };
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) notFound();

  const [allActive, allSold, allReviews, allCards, settings] = await Promise.all([
    getActiveListings(),
    getSoldListings(),
    getReviews(),
    listCards(),
    getSiteSettings(),
  ]);

  const active = allActive.filter((l) => l.agent.id === agent.id);
  const sold = allSold.filter((l) => l.agent.id === agent.id);
  const reviews = allReviews.filter((r) => r.agentId === agent.id);
  const articles = allCards.filter((c) => c.author === agent.name).slice(0, 4);

  return (
    <>
      <Header current="Team" nav={settings.nav} />
      <main>
        <AgentHero agent={agent} />
        <section className={s.body}>
          <Container>
            <div className={s.split}>
              <div className={s.main}>
                <AgentBio agent={agent} />
                <AgentSuburbs patches={agent.patches} />
                <AgentVideos featured={agent.featuredVideo} reels={agent.reels} />
                <AgentListings active={active} sold={sold} agentName={agent.name} />
                <AgentTestimonials reviews={reviews} />
                <AgentContent items={articles} />
              </div>
              <ContactCard agent={agent} />
            </div>
          </Container>
        </section>
        <AgentFooterCta agent={agent} />
      </main>
    </>
  );
}
