"use client";

import { useState } from "react";
import { IconChevron } from "@/components/icons";
import type { Agent } from "@/lib/agents/types";
import s from "./agent.module.css";

export function AgentBio({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const hasMore = agent.bioMore.length > 0;

  return (
    <section className={s.section}>
      <div className="overline">§ About</div>
      <h2 className={s.bioH2}>{agent.bioHeading}</h2>
      <div className={s.bioBody}>
        <p dangerouslySetInnerHTML={{ __html: agent.bioLead }} />
        {open
          ? agent.bioMore.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))
          : null}
      </div>
      {hasMore ? (
        <button
          type="button"
          className={s.bioToggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Read less" : "Read more"}
          <span className={`${s.bioToggleChev} ${open ? s.bioToggleChevOpen : ""}`}>
            <IconChevron />
          </span>
        </button>
      ) : null}
    </section>
  );
}
