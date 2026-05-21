"use client";

import { useState, type FormEvent, type ReactNode } from "react";

export type DoorstepFormProps = {
  /** Logical form identity, e.g. "appraisal" | "contact" | "newsletter". */
  formId: string;
  /** Values to pre-populate (e.g. enquiry type from a URL param). */
  prefill?: Record<string, string>;
  onSubmit?: (data: Record<string, string>) => void | Promise<void>;
  className?: string;
  children: ReactNode;
};

/**
 * Doorstep (Horace) integration seam — code handoff §9.
 *
 * The integration METHOD is not yet decided (embed script / iframe / API). Everything
 * Doorstep-specific is isolated HERE behind a stable API (formId / prefill / onSubmit) so
 * page layouts never depend on the method. When the method is confirmed, implement it in
 * this one component; call sites don't change.
 *
 * Foundation-slice behaviour: render the design-system fields passed as children inside a
 * <form> and capture submit locally (no network). TODO(§9): real routing + GA4/Ads/Pixel
 * conversion events + marketing-consent opt-in on submit success.
 */
export function DoorstepForm({ formId, onSubmit, className, children }: DoorstepFormProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    setSubmitting(true);
    try {
      console.info(`[DoorstepForm:${formId}] submit (stub)`, data);
      await onSubmit?.(data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      data-doorstep-form={formId}
      className={className}
      onSubmit={handleSubmit}
      aria-busy={submitting}
    >
      {children}
    </form>
  );
}
