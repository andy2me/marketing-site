"use client";

import { LeadForm } from "./LeadForm";
import styles from "./NewsletterForm.module.css";

/** Footer + Insights newsletter signup (formId="newsletter"). */
export function NewsletterForm() {
  return (
    <LeadForm formId="newsletter" className={styles.form}>
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="you@email.com"
        aria-label="Email address"
        required
      />
      <button type="submit" className="btn btn-primary btn-sm" style={{ height: 44 }}>
        Subscribe
      </button>
    </LeadForm>
  );
}
