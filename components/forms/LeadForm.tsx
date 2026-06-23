"use client";

import { useState, type FormEvent, type ReactNode } from "react";

export type LeadFormProps = {
  /** Logical form identity, e.g. "appraisal" | "contact" | "newsletter". */
  formId: string;
  /** Values to pre-populate (e.g. listing address, enquiry type) so the visitor
   *  is never asked for context we already know. Rendered as hidden inputs. */
  prefill?: Record<string, string>;
  /** Called after a successful submit — lets a parent swap in its own success UI
   *  (e.g. the agent card). When omitted, LeadForm shows `successMessage`. */
  onSubmit?: (data: Record<string, string>) => void | Promise<void>;
  className?: string;
  successMessage?: string;
  children: ReactNode;
};

const ENDPOINT = "/api/leads";
const DEFAULT_SUCCESS = "Thanks — we've got your details and will be in touch shortly.";

/**
 * First-party form seam (code handoff §9 — replaces the retired Doorstep embed).
 *
 * Renders the design-system fields passed as children inside a real <form> and
 * submits them as FormData to the same-origin /api/leads route. Because there is
 * no third-party script or iframe, ad blockers / tracking protection can't break
 * submission. Anti-spam (honeypot + fill-time trap) is carried as hidden fields
 * and enforced server-side.
 */
export function LeadForm({
  formId,
  prefill,
  onSubmit,
  className,
  successMessage = DEFAULT_SUCCESS,
  children,
}: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  // Render time, used by the server-side time-trap. Set once.
  const [renderedAt] = useState(() => String(Date.now()));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error(`submit failed (${res.status})`);
      await onSubmit?.(data);
      formEl.reset();
      setStatus("success");
    } catch (err) {
      console.error(`[LeadForm:${formId}] submit failed`, err);
      setStatus("error");
    }
  }

  // When no parent handles success, show a confirmation in place of the form.
  if (status === "success" && !onSubmit) {
    return (
      <div className={className} role="status" data-lead-form={formId} data-state="success">
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      data-lead-form={formId}
      className={className}
      onSubmit={handleSubmit}
      aria-busy={status === "submitting"}
      noValidate
    >
      <input type="hidden" name="formId" value={formId} />
      <input type="hidden" name="_ts" value={renderedAt} />
      {prefill
        ? Object.entries(prefill).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))
        : null}
      {/* Honeypot — hidden from users; bots that fill it are dropped server-side. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Company
          <input type="text" name="_company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {children}

      {status === "error" ? (
        <p role="alert" data-lead-error>
          Something went wrong sending your enquiry. Please try again, or email us directly.
        </p>
      ) : null}
    </form>
  );
}
