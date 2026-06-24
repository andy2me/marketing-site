"use client";

import { useState } from "react";
import { LeadForm } from "./LeadForm";
import s from "../content/Guide.module.css";

/** Email-gated lead-magnet form (in-body card). Submits to /api/leads with a
 *  per-asset formId so the inbox/CRM can tell downloads apart, and shows a
 *  short inline confirmation on success in place of the input row. */
export function LeadMagnetForm({
  assetId,
  assetTitle,
  action,
  successMessage = "Thanks — check your inbox for the PDF.",
}: {
  assetId: string;
  assetTitle: string;
  action: string;
  successMessage?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className={s.leadMagnetSuccess} role="status">
        {successMessage}
      </p>
    );
  }

  return (
    <LeadForm
      formId={`leadmagnet-${assetId}`}
      prefill={{ asset: assetTitle }}
      className={s.leadMagnetForm}
      onSubmit={() => setSubmitted(true)}
    >
      <input
        type="email"
        name="email"
        placeholder="you@email.com"
        className={s.leadMagnetInput}
        aria-label="Email address"
        required
      />
      <button
        type="submit"
        className={`btn btn-primary ${s.leadMagnetBtn}`}
      >
        {action}
      </button>
    </LeadForm>
  );
}
