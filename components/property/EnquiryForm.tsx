"use client";

import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { IconArrowR } from "@/components/icons";
import s from "./detail.module.css";

function Field({
  label,
  name,
  type = "text",
  textarea,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      {textarea ? (
        <textarea name={name} rows={3} className={s.textarea} defaultValue={defaultValue} />
      ) : (
        <input name={name} type={type} className={s.input} defaultValue={defaultValue} />
      )}
    </label>
  );
}

/** Agent enquiry form in the sticky panel (formId="enquiry"). */
export function EnquiryForm({ street }: { street: string }) {
  const router = useRouter();
  return (
    <LeadForm
      formId="enquiry"
      prefill={{ listing: street }}
      className={s.enqForm}
      onSubmit={(data) => {
        const qs = new URLSearchParams({ form: "enquiry", address: street });
        const first = (data.name ?? "").split(/\s+/)[0];
        if (first) qs.set("name", first);
        router.push(`/thank-you?${qs.toString()}`);
      }}
    >
      <div className={s.enqTitle}>Make an enquiry</div>
      <div className={s.enqSub}>Typical reply in under 2 hours.</div>
      <div className={s.enqFields}>
        <Field label="Full name" name="name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Phone" name="phone" type="tel" />
        <Field
          label="Message"
          name="message"
          textarea
          defaultValue={`Hi, I'd like to know more about ${street}…`}
        />
      </div>
      <label className={s.enqConsent}>
        <input type="checkbox" name="similar" defaultChecked />
        <span>Send me similar listings as they come to market.</span>
      </label>
      <button type="submit" className={`btn btn-primary ${s.enqSubmit}`}>
        Send enquiry <IconArrowR />
      </button>
      <div className={s.enqFine}>
        By sending this enquiry you agree to Max.&rsquo;s{" "}
        <a href="/privacy" className={s.enqLink}>
          privacy policy
        </a>
        .
      </div>
    </LeadForm>
  );
}
