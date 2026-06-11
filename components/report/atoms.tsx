"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/report/events";
import { useReport } from "./report-context";
import { IconArrowR, IconPhone, IconMail } from "@/components/icons";
import s from "./report.module.css";

type CtaKind = "ember" | "fern" | "mulberry" | "quiet";

/** Inline CTA card — appears at natural decision points (design handoff §Interactions).
 *  Dispatches report.cta.click, then routes to the team section where contact lives. */
export function InlineCTA({
  section,
  label,
  sublabel,
  kind = "ember",
}: {
  section: string;
  label: string;
  sublabel?: string;
  kind?: CtaKind;
}) {
  const router = useRouter();
  const { slug, email, contactRoute } = useReport();
  const kindClass = {
    ember: s.ctaEmber,
    fern: s.ctaFern,
    mulberry: s.ctaMulberry,
    quiet: s.ctaQuiet,
  }[kind];
  return (
    <button
      type="button"
      className={[s.inlineCta, kindClass].join(" ")}
      onClick={() => {
        track({ type: "report.cta.click", slug, section, label, email });
        router.push(contactRoute);
      }}
    >
      <span className={s.inlineCtaText}>
        {sublabel ? <span className={`overline ${s.inlineCtaSub}`}>{sublabel}</span> : null}
        <span className={s.inlineCtaLabel}>{label}</span>
      </span>
      <span className={s.inlineCtaArrow} aria-hidden>
        <IconArrowR />
      </span>
    </button>
  );
}

/** Contact row (call / email / book) — dispatches report.contact.click and performs the action. */
export function ContactRow({
  channel,
  icon,
  label,
  value,
  actionLabel,
  href,
}: {
  channel: "call" | "email" | "book";
  icon: ReactNode;
  label: string;
  value: string;
  actionLabel: string;
  href: string;
}) {
  const { slug, email, agentId } = useReport();
  return (
    <div className={s.contactRow}>
      <span className={s.contactRowIcon} aria-hidden>
        {icon}
      </span>
      <div className={s.contactRowBody}>
        <div className="overline">{label}</div>
        <div className={s.contactRowValue}>{value}</div>
      </div>
      <a
        className={s.contactRowAction}
        href={href}
        onClick={() => track({ type: "report.contact.click", slug, agentId, channel, email })}
      >
        {actionLabel}
      </a>
    </div>
  );
}

/** Next-steps primary action cluster — arrange a walk-through, call, email. */
export function NextStepsActions() {
  const router = useRouter();
  const { slug, email, agentId, agent, contactRoute } = useReport();
  const first = agent.name.split(" ")[0];
  const tel = `tel:${agent.phone.replace(/\s+/g, "")}`;
  const mailto = `mailto:${agent.email}`;
  return (
    <>
      <button
        type="button"
        className={s.nextPrimary}
        onClick={() => {
          track({ type: "report.cta.click", slug, section: "next", label: "Arrange a walk-through", email });
          router.push(contactRoute);
        }}
      >
        Arrange a walk-through
        <span aria-hidden>
          <IconArrowR />
        </span>
      </button>
      <div className={s.nextGhostRow}>
        <a
          className={s.nextGhost}
          href={tel}
          onClick={() => track({ type: "report.contact.click", slug, agentId, channel: "call", email })}
        >
          <IconPhone /> Call {first}
        </a>
        <a
          className={s.nextGhost}
          href={mailto}
          onClick={() => track({ type: "report.contact.click", slug, agentId, channel: "email", email })}
        >
          <IconMail /> Email
        </a>
      </div>
    </>
  );
}

/** Next-steps secondary actions — Download / Save / Forward.
 *  Download opens a printable version of the proposal in a new tab and auto-fires the browser
 *  print dialog so the vendor can save as PDF. Save/Forward remain stubs (forward copies URL). */
export function SecondaryActions() {
  const { slug, email } = useReport();
  const actions = [
    { label: "Download as PDF", sub: "Opens a printable version — save or print", kind: "download" as const },
    { label: "Save for later", sub: "Bookmark; we won't email you", kind: "save" as const },
    { label: "Forward to your partner", sub: "Copy a read-only link", kind: "forward" as const },
  ];
  return (
    <div className={s.secondaryActions}>
      {actions.map((a) => (
        <button
          key={a.kind}
          type="button"
          className={s.secondaryAction}
          onClick={() => {
            track({ type: "report.cta.click", slug, section: "next", label: a.label, email });
            if (a.kind === "forward" && typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href).catch(() => {});
            }
            if (a.kind === "download" && typeof window !== "undefined") {
              window.open(`/property/report/${slug}/print`, "_blank", "noopener");
            }
          }}
        >
          <span>
            <span className={s.secondaryActionLabel}>{a.label}</span>
            <span className={s.secondaryActionSub}>{a.sub}</span>
          </span>
          <span className={s.secondaryActionArrow} aria-hidden>
            <IconArrowR />
          </span>
        </button>
      ))}
    </div>
  );
}
