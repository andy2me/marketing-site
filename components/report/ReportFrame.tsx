"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { Report, BrandTone } from "@/lib/report/types";
import { getStoredEmail, storeEmail } from "@/lib/report/gate-storage";
import { track } from "@/lib/report/events";
import { ReportProvider, type ReportContextValue } from "./report-context";
import { ReportShell } from "./ReportShell";
import { ReportGate } from "./ReportGate";
import { ReportAnalytics } from "./ReportAnalytics";
import s from "./frame.module.css";

const ACCENT_HOVER: Partial<Record<BrandTone, string>> = {
  ember: "var(--color-action-hover)",
};

/** Top-level client frame for a report: holds gate state, blurs the proposal behind the gate,
 *  provides per-report context to section atoms, and mounts engagement instrumentation once
 *  the gate is cleared. The agent's email doubles as the stable agentId for the stub sink. */
export function ReportFrame({ report, children }: { report: Report; children: ReactNode }) {
  const agentId = report.agent.email;
  // One state object so the post-mount hydration is a single update. We render gated on the
  // server/first paint, then reveal after reading localStorage (avoids a hydration mismatch).
  const [gate, setGate] = useState<{ hydrated: boolean; email: string | null }>({
    hydrated: false,
    email: null,
  });
  const { hydrated, email } = gate;

  // Restore a previously-captured email (returning vendor isn't re-prompted).
  useEffect(() => {
    const stored = getStoredEmail(report.slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage after mount is the intended external-sync pattern
    setGate({ hydrated: true, email: stored });
  }, [report.slug]);

  // Gate-view event (only meaningful once we know the gate will show).
  useEffect(() => {
    if (hydrated && !email) {
      track({ type: "report.gate.view", slug: report.slug, agentId });
    }
  }, [hydrated, email, report.slug, agentId]);

  const cleared = !!email;

  const ctx: ReportContextValue = useMemo(
    () => ({
      slug: report.slug,
      agentId,
      email,
      agent: { name: report.agent.name, phone: report.agent.phone, email: report.agent.email },
      contactRoute: `/property/report/${report.slug}/your-team`,
    }),
    [report.slug, agentId, email, report.agent.name, report.agent.phone, report.agent.email],
  );

  function handleSubmit(value: string) {
    storeEmail(report.slug, value);
    setGate({ hydrated: true, email: value });
    track({ type: "report.gate.submit", slug: report.slug, agentId, email: value });
  }

  // Optional per-property accent (design handoff §Accent themability). Defaults to ember.
  const accentStyle: CSSProperties | undefined =
    report.accent && report.accent !== "ember"
      ? ({
          "--color-action": `var(--${report.accent})`,
          "--color-action-hover": ACCENT_HOVER[report.accent] ?? `var(--${report.accent})`,
        } as CSSProperties)
      : undefined;

  return (
    <ReportProvider value={ctx}>
      <div style={accentStyle}>
        <div className={cleared ? undefined : s.gated} aria-hidden={!cleared}>
          <ReportShell report={report}>{children}</ReportShell>
        </div>
        {hydrated && !cleared ? <ReportGate report={report} onSubmit={handleSubmit} /> : null}
        {cleared ? <ReportAnalytics slug={report.slug} email={email} /> : null}
      </div>
    </ReportProvider>
  );
}
