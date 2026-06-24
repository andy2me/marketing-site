"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { Overline } from "@/components/ui/Overline";
import { IconChevron, IconArrowR } from "@/components/icons";
import s from "./contact.module.css";

type Enquiry = "sell" | "buy" | "media" | "careers" | "general";

const ENQUIRY_OPTIONS: { v: Enquiry; l: string }[] = [
  { v: "sell", l: "I'm selling a property" },
  { v: "buy", l: "I'm buying a property" },
  { v: "media", l: "Media & press" },
  { v: "careers", l: "Careers" },
  { v: "general", l: "General enquiry" },
];

// Content → WordPress ACF (§7). Extensible: add a key to each table.
const ENQUIRY_AGENT: Record<Enquiry, { name: string; role: string; note: string; resp: string }> = {
  sell: { name: "Matt Powe", role: "Principal · Founder", note: "Matt handles every appraisal personally. Expect a call inside one business day to schedule a walk-through.", resp: "Inside 4 hours" },
  buy: { name: "Matt Powe", role: "Principal · Founder", note: "Matt handles buyer enquiries personally — expect a call inside one business day with what's on and what's coming.", resp: "Within 1 business day" },
  media: { name: "Matt Powe", role: "Principal · Founder", note: "For interview, photography or comment requests, Matt is your fastest path to a quote on the record.", resp: "Same day" },
  careers: { name: "Matt Powe", role: "Principal · Founder", note: "Matt reads every note that comes through — speculative welcome, we keep them on file.", resp: "Within 1 business day" },
  general: { name: "Matt Powe", role: "Principal · Founder", note: "For anything that doesn't fit a box — questions, referrals, market chats — Matt will route it to the right person.", resp: "Within 1 business day" },
};

const FORM_HEADING: Record<Enquiry, string> = {
  sell: "Tell us about your home.",
  buy: "What are you looking for?",
  media: "Tell us about the story.",
  careers: "Tell us about you.",
  general: "How can we help?",
};

const TEXTAREA_LABEL: Record<Enquiry, string> = {
  sell: "Anything we should know? (renovations, tenancy, deadlines)",
  buy: "What does the perfect home look like to you?",
  media: "Brief on the story / angle",
  careers: "Tell us about yourself",
  general: "Tell us a little more",
};

function LField({ label, name, placeholder, full }: { label: string; name: string; placeholder?: string; full?: boolean }) {
  return (
    <label className={full ? s.full : undefined}>
      <Overline style={{ fontSize: 11 }}>{label}</Overline>
      <input className={s.lInput} name={name} placeholder={placeholder} />
    </label>
  );
}
function LSelect({ label, name, options, full }: { label: string; name: string; options: string[]; full?: boolean }) {
  return (
    <label className={full ? s.full : undefined}>
      <Overline style={{ fontSize: 11 }}>{label}</Overline>
      <select className={s.lSelect} name={name} defaultValue={options[0]} aria-label={label}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = (searchParams.get("enquiry") as Enquiry) || "sell";
  const valid: Enquiry[] = ["sell", "buy", "media", "careers", "general"];
  const [enquiry, setEnquiry] = useState<Enquiry>(valid.includes(initial) ? initial : "sell");
  const [pref, setPref] = useState("Either");

  const agent = ENQUIRY_AGENT[enquiry];

  const onEnquiryChange = (v: Enquiry) => {
    setEnquiry(v);
    router.replace(`/contact?enquiry=${v}`, { scroll: false });
  };

  return (
    <section className={s.formSec}>
      <div className="container">
        <div className={`${s.split} ${s.formGrid}`}>
          {/* Sidebar */}
          <aside>
            <div className={s.sideCard}>
              <Overline>Your point of contact</Overline>
              <div className={s.sideAgent}>
                <span className={s.sideAvatar}>
                  <Image
                    src="/assets/team/matt-powe-large.jpg"
                    alt={agent.name}
                    fill
                    sizes="64px"
                    className={s.sideAvatarImg}
                  />
                </span>
                <div>
                  <div className={s.sideName}>{agent.name}</div>
                  <div className={s.sideRole}>{agent.role}</div>
                </div>
              </div>
              <p className={s.sideNote}>{agent.note}</p>
              <div className={s.sideResp}>
                Response time
                <br />
                <span className={s.sideRespValue}>{agent.resp}</span>
              </div>
            </div>

            <div className={s.dropIn}>
              <Overline>Prefer to drop in?</Overline>
              <div className={s.dropInAddr}>
                14 Project Ave
                <br />
                Noosaville QLD 4566
              </div>
              <div className={s.dropInHours}>Mon–Fri · 9am–5pm</div>
            </div>
          </aside>

          {/* Form */}
          <LeadForm
            formId="contact"
            prefill={{ enquiry }}
            className={s.formCard}
            onSubmit={(data) => {
              const qs = new URLSearchParams({ form: "contact", enquiry });
              if (data.firstName) qs.set("name", data.firstName);
              if (data.address) qs.set("address", data.address);
              router.push(`/thank-you?${qs.toString()}`);
            }}
          >
            <div className={s.formHead}>
              <h2 className={s.formTitle}>{FORM_HEADING[enquiry]}</h2>
              <div className={s.formStep}>Step 1 of 1 · ~2 min</div>
            </div>

            <div className={s.enquiryWrap}>
              <Overline style={{ fontSize: 11 }}>What&rsquo;s your enquiry about?</Overline>
              <select
                className={s.enquirySelect}
                name="enquiry"
                value={enquiry}
                onChange={(e) => onEnquiryChange(e.target.value as Enquiry)}
                style={{ marginTop: 8 }}
                aria-label="What's your enquiry about?"
              >
                {ENQUIRY_OPTIONS.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
              <span className={s.enquiryChev} style={{ top: "calc(50% + 11px)" }}>
                <IconChevron />
              </span>
            </div>

            <div className={s.fieldGrid}>
              <LField label="First name" name="firstName" placeholder="Sarah" />
              <LField label="Last name" name="lastName" placeholder="Henley" />
              <LField label="Email" name="email" placeholder="sarah@email.com" />
              <LField label="Phone" name="phone" placeholder="04XX XXX XXX" />

              {enquiry === "sell" && (
                <>
                  <LField full label="Property address" name="address" placeholder="18 Hilltop Crescent, Noosaville QLD" />
                  <LSelect label="Property type" name="type" options={["House", "Apartment", "Townhouse", "Land"]} />
                  <LSelect label="Bedrooms" name="bedrooms" options={["1", "2", "3", "4", "5+"]} />
                  <LSelect full label="Timeline" name="timeline" options={["Just curious", "Within 3 months", "3–6 months", "6–12 months", "12+ months"]} />
                </>
              )}
              {enquiry === "buy" && (
                <>
                  <LSelect label="Suburb of interest" name="suburb" options={["Noosaville", "Noosa Heads"]} />
                  <LSelect label="Budget" name="budget" options={["Under $1M", "$1–2M", "$2–3M", "$3–5M", "$5M+"]} />
                  <LSelect label="Bedrooms" name="bedrooms" options={["1", "2", "3", "4", "5+"]} />
                  <LSelect label="Type" name="type" options={["House", "Apartment", "Townhouse", "Land"]} />
                </>
              )}
              {enquiry === "media" && (
                <>
                  <LField label="Publication" name="publication" placeholder="Domain · Vogue Living…" />
                  <LField label="Deadline" name="deadline" placeholder="dd / mm / yyyy" />
                  <LSelect full label="Request type" name="requestType" options={["Comment / quote", "Interview", "Photography access", "Data / market figures"]} />
                </>
              )}
              {enquiry === "careers" && (
                <>
                  <LSelect full label="Role of interest" name="role" options={["Sales Associate", "Campaign Coordinator", "Stylist (contract)", "Speculative"]} />
                  <LField full label="LinkedIn or portfolio URL" name="url" placeholder="linkedin.com/in/…" />
                </>
              )}

              <label className={s.full}>
                <Overline style={{ fontSize: 11 }}>{TEXTAREA_LABEL[enquiry]}</Overline>
                <textarea className={s.lTextarea} name="message" rows={4} />
              </label>
            </div>

            <div className={s.pref}>
              <Overline style={{ fontSize: 11 }}>Preferred contact</Overline>
              <div className={s.prefChips}>
                {["Email", "Phone", "Either"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${s.prefChip} ${pref === c ? s.prefChipActive : ""}`}
                    aria-pressed={pref === c}
                    onClick={() => setPref(c)}
                  >
                    <span className={s.prefDot} />
                    {c}
                  </button>
                ))}
              </div>
              <input type="hidden" name="preferredContact" value={pref} />
            </div>

            <div className={s.formFoot}>
              <div className={s.formFine}>
                We&rsquo;ll use your details to respond and nothing else. Read our{" "}
                <a href="/privacy">privacy policy</a>.
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>
                Send enquiry <IconArrowR />
              </button>
            </div>
          </LeadForm>
        </div>
      </div>
    </section>
  );
}
