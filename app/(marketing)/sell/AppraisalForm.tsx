"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import { IconArrowR } from "@/components/icons";
import s from "./sell.module.css";

const TYPES = ["House", "Apartment", "Townhouse", "Land"];
const BEDS = ["1", "2", "3", "4", "5+"];
const TIMELINE = ["Just curious", "Within 3 months", "3–6 months", "6–12 months", "12+ months"];

function DField({
  label,
  name,
  type = "text",
  placeholder,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <label className={full ? s.full : undefined}>
      <div className={s.dLabel}>{label}</div>
      <input className={s.dInput} name={name} type={type} placeholder={placeholder} />
    </label>
  );
}

function DSelect({
  label,
  name,
  options,
  full,
}: {
  label: string;
  name: string;
  options: string[];
  full?: boolean;
}) {
  return (
    <label className={full ? s.full : undefined}>
      <div className={s.dLabel}>{label}</div>
      <select className={s.dSelect} name={name} defaultValue={options[0]} aria-label={label}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Sell appraisal form — dark (formId="appraisal", §9). */
export function AppraisalForm() {
  return (
    <LeadForm formId="appraisal" className={s.form}>
      <div className={s.formGrid}>
        <DField label="First name" name="firstName" placeholder="Sarah" />
        <DField label="Last name" name="lastName" placeholder="Henley" />
        <DField label="Email" name="email" type="email" placeholder="sarah@email.com" />
        <DField label="Phone" name="phone" type="tel" placeholder="04XX XXX XXX" />
        <DField full label="Property address" name="address" placeholder="18 Hilltop Crescent, Noosaville QLD" />
        <DSelect label="Type" name="type" options={TYPES} />
        <DSelect label="Bedrooms" name="bedrooms" options={BEDS} />
        <DSelect full label="Timeline" name="timeline" options={TIMELINE} />
        <label className={s.full}>
          <div className={s.dLabel}>Anything we should know?</div>
          <textarea className={s.dTextarea} name="notes" rows={3} placeholder="Renovations, tenancy, deadlines…" />
        </label>
      </div>
      <div className={s.formFoot}>
        <div className={s.formFine}>
          Your details stay with us — read our <a href="/privacy">privacy policy</a>.
        </div>
        <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: 220 }}>
          Request appraisal <IconArrowR />
        </button>
      </div>
    </LeadForm>
  );
}
