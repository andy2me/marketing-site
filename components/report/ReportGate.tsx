"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconMail, IconArrowR, IconLock } from "@/components/icons";
import { isValidEmail } from "@/lib/report/gate-storage";
import s from "./gate.module.css";

// Email-gate modal — centred over a blurred preview. Non-dismissable until a valid email is
// submitted (design handoff §Email-gate modal). Simple regex; no verification email (open Q#5).
export function ReportGate({
  report,
  onSubmit,
}: {
  report: Report;
  onSubmit: (email: string) => void;
}) {
  const { vendor, agent } = report;
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = isValidEmail(email);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const errorId = useId();
  const agentFirst = agent.name.split(" ")[0];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus trap — keep Tab within the modal (the gate cannot be dismissed).
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function submit() {
    if (!valid) {
      setTouched(true);
      return;
    }
    onSubmit(email.trim());
  }

  return (
    <div className={s.overlay}>
      <div className={s.scrim} />
      <div
        ref={panelRef}
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onKeyDown={onKeyDown}
      >
        <div className={s.banner}>
          <ImageSlot
            label="hero · 17/140 noosa parade · river twilight"
            ratio="auto"
            className={s.bannerImg}
          />
          <div className={s.bannerScrim} />
          <div className={s.bannerTop}>
            <span className={s.bannerWordmark}>
              Max<span className={s.dot}>.</span>
            </span>
            <span className={s.bannerKicker}>Private appraisal</span>
          </div>
          <div className={s.bannerBottom}>
            <div className={s.bannerFor}>For</div>
            <div className={s.bannerName}>{vendor.fullName}</div>
          </div>
        </div>

        <div className={s.body}>
          <h2 id={headingId} className={s.heading}>
            Before you read on<span className={s.dot}>,</span>
            <br />
            <em className={s.headingEm}>just</em> a name on the door.
          </h2>
          <p className={s.intro}>
            This proposal is prepared for {vendor.firstName} privately. Confirm your email so{" "}
            {agentFirst} can follow up properly — no list, no auto-emails.
          </p>

          <label className={s.field}>
            <span className={`overline ${s.fieldLabel}`}>Email address</span>
            <span className={s.inputWrap}>
              <span className={s.inputIcon} aria-hidden>
                <IconMail />
              </span>
              <input
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                className={[s.input, touched && !valid ? s.inputError : ""].join(" ")}
                value={email}
                placeholder={`${vendor.firstName.toLowerCase()}@email.com`}
                aria-invalid={touched && !valid}
                aria-describedby={touched && !valid ? errorId : undefined}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
              />
            </span>
            {touched && !valid ? (
              <span id={errorId} className={s.error}>
                Please enter a valid email address.
              </span>
            ) : null}
          </label>

          <button type="button" className={s.submit} disabled={!valid} onClick={submit}>
            Read the proposal
            <IconArrowR />
          </button>

          <p className={s.note}>
            <span className={s.noteLock} aria-hidden>
              <IconLock />
            </span>
            <span>
              Only {agentFirst} sees this. Read our{" "}
              <a className={s.noteLink} href="/privacy">
                privacy note
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
