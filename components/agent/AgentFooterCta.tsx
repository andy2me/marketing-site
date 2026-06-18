// Banding CTA band at page foot. Server component.

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IconArrowR, IconPhone } from "@/components/icons";
import type { Agent } from "@/lib/agents/types";
import s from "./agent.module.css";

export function AgentFooterCta({ agent }: { agent: Agent }) {
  return (
    <section className={s.footerCta}>
      <Container>
        <div className={s.footerCtaInner}>
          <div>
            <div className="overline">§ The next step</div>
            <h2 className={s.footerCtaH2}>
              Find out what {agent.name.split(" ")[0]} thinks your home is worth.
            </h2>
          </div>
          <div className={s.footerCtaBtns}>
            <Button href="#appraisal" variant="primary" size="lg">
              Request an appraisal <IconArrowR />
            </Button>
            <Button href={agent.phoneHref} variant="secondary" size="lg">
              <IconPhone /> Call {agent.phone}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
