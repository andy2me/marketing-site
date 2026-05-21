"use client";

import { DoorstepForm } from "./DoorstepForm";
import styles from "./NewsletterForm.module.css";

/** Footer + Insights newsletter signup. Rides the Doorstep seam (formId="newsletter"). */
export function NewsletterForm() {
  return (
    <DoorstepForm formId="newsletter" className={styles.form}>
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
    </DoorstepForm>
  );
}
