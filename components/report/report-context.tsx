"use client";

import { createContext, useContext } from "react";

/** Shared per-report client context — lets section atoms dispatch engagement events and reach
 *  the assigned agent without prop-drilling through server section components. */
export type ReportContextValue = {
  slug: string;
  agentId: string;
  /** Captured vendor email, or null until the gate is cleared. */
  email: string | null;
  agent: { name: string; phone: string; email: string };
  /** Where generic "discuss / arrange" CTAs route — the team section (call/email/book live there). */
  contactRoute: string;
};

const ReportContext = createContext<ReportContextValue | null>(null);

export const ReportProvider = ReportContext.Provider;

export function useReport(): ReportContextValue {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within a ReportProvider");
  return ctx;
}
