"use client";

import { useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  IconArrowR,
  IconCheck,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconYouTube,
} from "@/components/icons";
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

export function ContactCard({ agent }: { agent: Agent }) {
  const [sent, setSent] = useState(false);

  return (
    <aside className={s.contactWrap} aria-label={`Contact ${agent.name}`}>
      <div className={s.contactCard} id="appraisal">
        <div className={s.contactHead}>
          {agent.headshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agent.headshot} alt={agent.name} className={s.contactHeadAvatar} />
          ) : (
            <span className={s.contactHeadAvatarFallback} aria-hidden>
              {initials(agent.name)}
            </span>
          )}
          <div>
            <div className={s.contactHeadName}>{agent.name}</div>
            <div className={s.contactHeadPatch}>{agent.patchLine}</div>
          </div>
        </div>

        <div className={s.contactDirect}>
          <a href={agent.phoneHref} className={s.contactRow}>
            <span className={s.contactIcon} aria-hidden>
              <IconPhone size={18} />
            </span>
            <span>
              <span className={s.contactRowKicker}>Direct</span>
              <span className={s.contactRowValue}>{agent.phone}</span>
            </span>
          </a>
          <a href={`mailto:${agent.email}`} className={s.contactRow}>
            <span className={s.contactIcon} aria-hidden>
              <IconMail size={18} />
            </span>
            <span>
              <span className={s.contactRowKicker}>Email</span>
              <span className={s.contactRowEmail}>{agent.email}</span>
            </span>
          </a>
        </div>

        {sent ? (
          <div className={s.contactSuccess}>
            <span className={s.contactSuccessBadge} aria-hidden>
              <IconCheck size={20} />
            </span>
            <h3 className={s.contactSuccessH3}>Got it — thanks.</h3>
            <p className={s.contactSuccessBody}>
              {agent.name.split(" ")[0]} will call you within one business day. If it&rsquo;s
              urgent, ring direct on {agent.phone}.
            </p>
            <button
              type="button"
              className={s.contactSuccessReset}
              onClick={() => setSent(false)}
            >
              Send another →
            </button>
          </div>
        ) : (
          <div className={s.contactForm}>
            <h3 className={s.contactFormHead}>Request an appraisal</h3>
            <p className={s.contactFormReassure}>
              Honest pricing, in writing — no obligation.
            </p>
            <LeadForm
              formId={`appraisal-agent-${agent.slug}`}
              onSubmit={() => setSent(true)}
              className={s.contactFormFields}
            >
              <input type="hidden" name="agentId" value={agent.id} />
              <input type="hidden" name="agentName" value={agent.name} />
              <label className={s.contactField}>
                <span className={s.contactFieldLabel}>Your name</span>
                <input
                  className={s.contactFieldInput}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                />
              </label>
              <label className={s.contactField}>
                <span className={s.contactFieldLabel}>Email or phone</span>
                <input
                  className={s.contactFieldInput}
                  name="contact"
                  type="text"
                  required
                  autoComplete="email"
                />
              </label>
              <label className={s.contactField}>
                <span className={s.contactFieldLabel}>Property address</span>
                <input
                  className={s.contactFieldInput}
                  name="address"
                  type="text"
                  placeholder="Street, suburb"
                />
              </label>
              <button type="submit" className={`btn btn-primary ${s.contactSubmit}`}>
                Send to {agent.name.split(" ")[0]} <IconArrowR />
              </button>
            </LeadForm>
          </div>
        )}

        {agent.socials.instagram || agent.socials.facebook || agent.socials.youtube ? (
          <div style={{ padding: "0 24px 20px" }}>
            <div className={s.contactSocialRow}>
              <span className={s.contactSocialLabel}>Follow {agent.name.split(" ")[0]}</span>
              <span className={s.contactSocialLinks}>
                {agent.socials.instagram ? (
                  <a href={agent.socials.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                    <IconInstagram />
                  </a>
                ) : null}
                {agent.socials.facebook ? (
                  <a href={agent.socials.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                    <IconFacebook />
                  </a>
                ) : null}
                {agent.socials.youtube ? (
                  <a href={agent.socials.youtube} aria-label="YouTube" target="_blank" rel="noreferrer">
                    <IconYouTube />
                  </a>
                ) : null}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
