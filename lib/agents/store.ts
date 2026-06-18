// Max Property — Agent profile store (accessor seam).
// Mirrors lib/insights/store.ts. Today: one registered agent (Matt Powe). New
// agents register by adding to AGENTS; generateStaticParams on /team/[slug]
// picks them up automatically.
//
// SWAP PATH: when a headless CMS or Rex contact feed lands, this registry moves
// to a fetcher — call sites (getAgent / getAgentSlugs / listAgents) don't change.

import type { Agent } from "./types";
import { matt } from "@/data/agents/matt-powe";
import { kirsty } from "@/data/agents/kirsty-kernot";

const AGENTS: Record<string, Agent> = {
  [matt.slug]: matt,
  [kirsty.slug]: kirsty,
};

export async function getAgent(slug: string): Promise<Agent | null> {
  return AGENTS[slug] ?? null;
}

export async function getAgentSlugs(): Promise<string[]> {
  return Object.keys(AGENTS);
}

export async function listAgents(): Promise<Agent[]> {
  return Object.values(AGENTS);
}
