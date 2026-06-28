"use client";

// Buyer-interest modal (handoff §"Buyer-interest registration modal").
//
// Two steps: form → verify. Portal-rendered into document.body so the dark
// scrim overlays the whole viewport, with the modal panel centred above. The
// prototype's `.mp` scoping caveat does NOT apply here — globals.css in this
// codebase ports the prototype's styles un-scoped to real document elements,
// so the portal lands them as styled regardless of mount point.
//
// Form submission funnels through LeadForm + /api/leads + the existing Resend +
// Rex pipeline. New LeadKinds (complex-interest / unit-interest) are wired in
// lib/leads/types.ts. Soft verify: lead is saved immediately; the "Check your
// inbox" panel is a soft signal, not a token gate. Double-opt-in is a follow-up.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowR, IconClose, IconEnvelope, IconPin } from "@/components/icons";
import { LeadForm } from "@/components/forms/LeadForm";
import { track } from "@/lib/horace/track";
import type { BuyerInterestEntity } from "./BuyerInterestProvider";

const FIELD_INPUT: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-subtle)",
  color: "var(--color-text-primary)",
  fontFamily: "inherit",
  fontSize: 14,
  width: "100%",
};

export function BuyerInterestModal({
  open,
  type,
  unitNumber,
  entity,
  onClose,
}: {
  open: boolean;
  type: "complex" | "unit";
  unitNumber?: number;
  entity: BuyerInterestEntity;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");

  // Reset to step "form" each time the modal opens (handoff §State Management).
  useEffect(() => {
    if (open) {
      setStep("form");
      setEmail("");
    }
  }, [open]);

  // Lock body scroll while open, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const isUnit = type === "unit";
  const entityLabel = isUnit
    ? `Unit ${unitNumber}, ${entity.complexName}`
    : entity.complexName;
  const title = isUnit
    ? `Register interest in Unit ${unitNumber}`
    : `Register interest in ${entity.complexName}`;
  const formId = isUnit ? "unit-interest" : "complex-interest";
  const prefill: Record<string, string> = {
    entity_type: isUnit ? "unit" : "complex",
    entity_id: isUnit
      ? `${entity.complexSlug}/unit-${unitNumber}`
      : entity.complexSlug,
    complex_slug: entity.complexSlug,
    complex_name: entity.complexName,
    listing: entityLabel,
  };
  if (isUnit && unitNumber !== undefined) {
    prefill.unit_number = String(unitNumber);
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(26,18,12,.55)",
        backdropFilter: "blur(3px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        animation: "biFade 180ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--color-bg-surface)",
          borderRadius: 18,
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          animation: "biRise 220ms cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {/* Header band */}
        <div
          style={{
            padding: "22px 26px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--color-action)",
              }}
            >
              {isUnit ? "Unit-level interest" : "Complex-level interest"}
            </p>
            <h3
              style={{
                marginTop: 8,
                fontSize: 24,
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.01em",
                color: "var(--color-text-strong)",
              }}
            >
              {step === "form" ? title : "One last step"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-text-secondary)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <IconClose />
          </button>
        </div>

        {step === "form" ? (
          <LeadForm
            formId={formId}
            prefill={prefill}
            className=""
            onSubmit={(data) => {
              const v = data["email"];
              if (typeof v === "string") setEmail(v);
              const hasBudget = Boolean(
                data["budget_range"] && data["budget_range"] !== "No preference",
              );
              const hasTimeframe = Boolean(
                data["timeframe"] && data["timeframe"] !== "Just watching",
              );
              const entityId = isUnit
                ? `${entity.complexSlug}/unit-${unitNumber}`
                : entity.complexSlug;
              if (isUnit && unitNumber !== undefined) {
                track.unitBuyerInterestSubmitted({
                  complexId: entity.complexSlug,
                  unitId: `unit-${unitNumber}`,
                  hasBudget,
                  hasTimeframe,
                });
              } else {
                track.complexBuyerInterestSubmitted({
                  complexId: entity.complexSlug,
                  hasBudget,
                  hasTimeframe,
                });
              }
              // Identity stitch — strongest signal Horace has on this visitor.
              track.identityRegistered({
                entityType: isUnit ? "unit" : "complex",
                entityId,
                registrationType: isUnit ? "unit" : "complex",
                email: typeof v === "string" ? v : "",
              });
              setStep("verify");
            }}
          >
            <div style={{ padding: "22px 26px 26px" }}>
              {/* Value-exchange box */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "var(--soft-linen-500)",
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: "var(--lime)",
                    color: "var(--fern)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <IconPin />
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--color-text-primary)",
                  }}
                >
                  You tell us you want it — Matt tells you if it moves. No offer,
                  no obligation. Just a direct line when something changes in{" "}
                  {isUnit ? "this unit" : "the building"}.
                </p>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Full name" required name="name" />
                  <Field label="Phone" required name="phone" type="tel" />
                </div>
                <Field
                  label="Email"
                  required
                  name="email"
                  type="email"
                  hint="We&rsquo;ll verify this before you&rsquo;re registered."
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Select
                    label="Budget range"
                    optional
                    name="budget_range"
                    options={[
                      "No preference",
                      "Up to $1.2M",
                      "$1.2M – $1.6M",
                      "$1.6M – $2.2M",
                      "$2.2M+",
                    ]}
                  />
                  <Select
                    label="Timeframe"
                    optional
                    name="timeframe"
                    options={[
                      "Just watching",
                      "0–3 months",
                      "3–6 months",
                      "6–12 months",
                    ]}
                  />
                </div>
                <Field
                  label="Anything Matt should know?"
                  optional
                  name="message"
                  textarea
                  placeholder={
                    isUnit
                      ? "e.g. We've rented in the building for two years and want to buy in…"
                      : "e.g. After a north-east two-bedder, no rush but ready when one comes up…"
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 22 }}
              >
                Register my interest <IconArrowR />
              </button>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 11.5,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Soft registration · no price commitment. Email verified before
                completion · rate-limited. Your details are private to Max
                Property — never shown publicly on this page.
              </p>
            </div>
          </LeadForm>
        ) : (
          <div style={{ padding: "32px 26px 34px", textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                margin: "0 auto 20px",
                borderRadius: 999,
                background: "var(--soft-linen-500)",
                color: "var(--color-action)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <IconEnvelope />
            </div>
            <h4
              style={{
                fontSize: 20,
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                color: "var(--color-text-strong)",
              }}
            >
              Check your inbox
            </h4>
            <p
              style={{
                marginTop: 12,
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--color-text-secondary)",
                maxWidth: 380,
                margin: "12px auto 0",
              }}
            >
              We&rsquo;ve sent a verification link to{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                {email || "your email"}
              </strong>
              . Confirm it and your interest in{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                {entityLabel}
              </strong>{" "}
              is registered with Matt.
            </p>
            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Done
              </button>
            </div>
            <p
              style={{
                marginTop: 18,
                fontSize: 11.5,
                color: "var(--color-text-secondary)",
              }}
            >
              Didn&rsquo;t arrive? Check spam, or{" "}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: "var(--color-action)" }}
              >
                resend the link
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes biFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes biRise {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>,
    document.body,
  );
}

// ── Field / Select ────────────────────────────────────────────────────────
function Field({
  label,
  required,
  optional,
  name,
  type = "text",
  textarea,
  placeholder,
  hint,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {optional && (
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--white-mist-500)",
            }}
          >
            {" "}
            · optional
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          style={{ ...FIELD_INPUT, resize: "vertical" }}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          style={{ ...FIELD_INPUT, height: 44 }}
        />
      )}
      {hint && (
        <span style={{ fontSize: 11.5, color: "var(--white-mist-500)" }}>{hint}</span>
      )}
    </label>
  );
}

function Select({
  label,
  optional,
  name,
  options,
}: {
  label: string;
  optional?: boolean;
  name: string;
  options: ReadonlyArray<string>;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {optional && (
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--white-mist-500)",
            }}
          >
            {" "}
            · optional
          </span>
        )}
      </span>
      <select name={name} style={{ ...FIELD_INPUT, height: 44 }}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
