// Agent profile hero — 5fr 7fr split (4:5 headshot + identity column)
// with stats row underneath. Server component — no interactivity.

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IconArrowR, IconPhone } from "@/components/icons";
import type { Agent } from "@/lib/agents/types";
import s from "./agent.module.css";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AgentHero({ agent }: { agent: Agent }) {
  return (
    <section className={s.hero}>
      <Container>
        <nav className={s.breadcrumb} aria-label="Breadcrumb">
          <Link href="/team">Team</Link>
          <span aria-hidden>·</span>
          <span className={s.breadcrumbCurrent}>{agent.name}</span>
        </nav>

        <div className={s.heroGrid}>
          <div className={s.heroPortrait}>
            {agent.headshot ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote host not in remotePatterns; matches project pattern.
              <img src={agent.headshot} alt={agent.name} />
            ) : (
              <span className={s.heroPortraitInitials} aria-hidden>
                {initials(agent.name)}
              </span>
            )}
          </div>

          <div>
            <div className="overline">§ Agent profile</div>
            <h1 className={s.heroH1}>
              {agent.name}
              <span className={s.heroH1Dot}>.</span>
            </h1>
            <div className={s.heroRole}>{agent.role}</div>
            <p className={s.heroPositioning}>{agent.positioning}</p>
            <div className={s.heroCtas}>
              <Button href="#appraisal" variant="primary" size="lg">
                Request an appraisal <IconArrowR />
              </Button>
              <Button href={agent.phoneHref} variant="secondary" size="lg">
                <IconPhone /> {agent.phone}
              </Button>
            </div>
          </div>
        </div>

        <div className={s.statsRow}>
          {agent.stats.map((stat) => (
            <div key={stat.label} className={s.statCell}>
              <div className={s.statValue}>
                {stat.value}
                {stat.suffix ? <span className={s.statSuffix}>{stat.suffix}</span> : null}
              </div>
              <div className={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
