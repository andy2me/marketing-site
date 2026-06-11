"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import type {
  Agent,
  Buyer,
  BrandTone,
  Marketing,
  Market,
  Property,
  Report,
  Vendor,
} from "@/lib/report/types";
import { JAMES_AGENT, blankComp, blankReport } from "@/lib/report/templates";
import { report as NOOSA_PARADE_PRESET } from "@/data/reports/17-140-noosa-parade-noosaville";
import {
  generateDomSeries,
  generateEnquirySeries,
  generatePriceSeries,
} from "@/lib/report/series";
import { reportToTsFile } from "@/lib/report/serialize";
import { addressToSlug } from "@/lib/report/slug";

import { ReportProvider } from "@/components/report/report-context";
import { Welcome } from "@/components/report/sections/Welcome";
import { TheMarket } from "@/components/report/sections/TheMarket";
import { YourBuyer } from "@/components/report/sections/YourBuyer";
import { Approach } from "@/components/report/sections/Approach";
import { Marketing as MarketingSection } from "@/components/report/sections/Marketing";
import { YourTeam } from "@/components/report/sections/YourTeam";
import { WhyMax } from "@/components/report/sections/WhyMax";
import { NextSteps } from "@/components/report/sections/NextSteps";

import s from "./composer.module.css";

const STORAGE_KEY = "mx.composer.draft.v2";
const TONES: BrandTone[] = ["fern", "clay", "mulberry", "ember", "sunrise", "lime"];
const PHASE_TONES: Array<BrandTone | "linen"> = ["linen", "fern", "mulberry", "ember", "clay", "sunrise"];

/** Trend params used to generate market series — not part of Report; persisted in localStorage alongside it. */
type Trend = {
  medianLatest: number; // $M
  medianYoy: number; // %
  domStart: number; // days, 24mo-ago end
  domEnd: number; // days, latest quarter
  enqLatest: number; // enquiries / month
  enqYoy: number; // %
};
const DEFAULT_TREND: Trend = {
  medianLatest: 1.65,
  medianYoy: 8.2,
  domStart: 38,
  domEnd: 21,
  enqLatest: 4280,
  enqYoy: 38,
};

/* ── Field helpers ──────────────────────────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <label className={s.field} style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <span className={s.label}>{label}</span>
      <input
        className={s.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className={s.hint}>{hint}</span> : null}
    </label>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <input
        className={s.input}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className={s.field} style={{ gridColumn: "1 / -1" }}>
      <span className={s.label}>{label}</span>
      <textarea
        className={s.textarea}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <select className={s.select} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Repeated<T>({
  items,
  onChange,
  newItem,
  render,
  addLabel,
  min = 0,
  max = 12,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  render: (item: T, set: (t: T) => void, idx: number) => ReactNode;
  addLabel: string;
  min?: number;
  max?: number;
}) {
  const setAt = (i: number, t: T) => onChange(items.map((x, j) => (j === i ? t : x)));
  return (
    <div className={s.repeated}>
      {items.map((item, i) => (
        <div key={i} className={s.repeatedRow}>
          <div className={s.repeatedBody}>{render(item, (t) => setAt(i, t), i)}</div>
          {items.length > min ? (
            <button
              type="button"
              className={s.btnRemove}
              aria-label="Remove"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          ) : (
            <div />
          )}
        </div>
      ))}
      {items.length < max ? (
        <button type="button" className={s.btnAdd} onClick={() => onChange([...items, newItem()])}>
          + {addLabel}
        </button>
      ) : null}
    </div>
  );
}

/* ── Composer ───────────────────────────────────────────────────────────── */
export function ReportComposer() {
  const [report, setReport] = useState<Report>(() => blankReport());
  const [trend, setTrend] = useState<Trend>(DEFAULT_TREND);
  const [view, setView] = useState<"form" | "preview">("form");
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Hydrate from localStorage; fill preparedOn with today if blank.
  /* eslint-disable react-hooks/set-state-in-effect -- intended external-sync pattern: read localStorage post-mount + default today's date (avoids SSR hydration mismatch) */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { report?: Report; trend?: Trend };
        if (parsed.report) setReport(parsed.report);
        if (parsed.trend) setTrend(parsed.trend);
      }
    } catch {
      // ignore
    }
    setReport((r) =>
      r.preparedOn
        ? r
        : {
            ...r,
            preparedOn: new Date().toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
    );
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Autosave
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ report, trend }));
      } catch {
        // ignore quota / private mode
      }
    }, 500);
    return () => clearTimeout(id);
  }, [report, trend, hydrated]);

  // Series are derived from `trend`, not stored, so the user can tune the trend freely without
  // a cascading setState/effect. The merged report is what gets previewed + serialized.
  const fullReport = useMemo<Report>(
    () => ({
      ...report,
      market: {
        ...report.market,
        medianSeries: generatePriceSeries(trend.medianLatest, trend.medianYoy, 24),
        domSeries: generateDomSeries(trend.domStart, trend.domEnd, 8),
        searchSeries: generateEnquirySeries(trend.enqLatest, trend.enqYoy, 12),
      },
    }),
    [report, trend],
  );

  /* ── Update helpers ─────────────────────────────────────────────────── */
  const setProperty = useCallback(
    <K extends keyof Property>(k: K, v: Property[K]) =>
      setReport((r) => ({ ...r, property: { ...r.property, [k]: v } })),
    [],
  );
  const setVendor = useCallback(
    <K extends keyof Vendor>(k: K, v: Vendor[K]) =>
      setReport((r) => ({ ...r, vendor: { ...r.vendor, [k]: v } })),
    [],
  );
  const setAgent = useCallback(
    <K extends keyof Agent>(k: K, v: Agent[K]) =>
      setReport((r) => ({ ...r, agent: { ...r.agent, [k]: v } })),
    [],
  );
  const setMarket = useCallback(
    <K extends keyof Market>(k: K, v: Market[K]) =>
      setReport((r) => ({ ...r, market: { ...r.market, [k]: v } })),
    [],
  );
  const setBuyer = useCallback(
    <K extends keyof Buyer>(k: K, v: Buyer[K]) =>
      setReport((r) => ({ ...r, buyer: { ...r.buyer, [k]: v } })),
    [],
  );
  const setMarketing = useCallback(
    <K extends keyof Marketing>(k: K, v: Marketing[K]) =>
      setReport((r) => ({ ...r, marketing: { ...r.marketing, [k]: v } })),
    [],
  );

  /** Address handler — also auto-derives the slug (unless user has manually customised it) and
   *  back-fills market.suburb. Kept in the change handler so we don't need a setState-in-effect. */
  const updateAddress = useCallback((field: "street" | "suburb", value: string) => {
    setReport((r) => {
      const nextProp = { ...r.property, [field]: value };
      const oldAutoSlug = addressToSlug(r.property.street, r.property.suburb);
      const nextAutoSlug = addressToSlug(nextProp.street, nextProp.suburb);
      const userCustomisedSlug = r.slug && r.slug !== oldAutoSlug;
      return {
        ...r,
        property: nextProp,
        slug: userCustomisedSlug ? r.slug : nextAutoSlug,
        market: r.market.suburb && r.market.suburb !== r.property.suburb ? r.market : { ...r.market, suburb: nextProp.suburb },
      };
    });
  }, []);

  /* ── Actions ────────────────────────────────────────────────────────── */
  function flashToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }
  async function copyTs() {
    const text = reportToTsFile(fullReport);
    try {
      await navigator.clipboard.writeText(text);
      flashToast(`Copied · ${text.length.toLocaleString()} chars`);
    } catch {
      flashToast("Clipboard blocked — use Download instead");
    }
  }
  function downloadTs() {
    const text = reportToTsFile(fullReport);
    const blob = new Blob([text], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullReport.slug || "draft"}.ts`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function reset() {
    if (!confirm("Reset the form to blank? Your draft will be lost.")) return;
    const blank = blankReport();
    blank.preparedOn = new Date().toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setReport(blank);
    setTrend(DEFAULT_TREND);
  }
  function loadPreset() {
    if (!confirm("Load the Noosa Parade reference? Your current draft will be replaced.")) return;
    setReport(JSON.parse(JSON.stringify(NOOSA_PARADE_PRESET)));
  }
  function loadJames() {
    setAgent("name", JAMES_AGENT.name);
    setAgent("role", JAMES_AGENT.role);
    setAgent("phone", JAMES_AGENT.phone);
    setAgent("email", JAMES_AGENT.email);
    setAgent("bio", JAMES_AGENT.bio);
    setAgent(
      "recent",
      JAMES_AGENT.recent.map((r) => ({ ...r })),
    );
  }

  /* ── Preview context ────────────────────────────────────────────────── */
  const previewCtx = useMemo(
    () => ({
      slug: report.slug || "draft",
      agentId: report.agent.email || "draft",
      email: null as string | null,
      agent: { name: report.agent.name, phone: report.agent.phone, email: report.agent.email },
      contactRoute: "/admin/new-report",
    }),
    [report.slug, report.agent.email, report.agent.name, report.agent.phone],
  );

  if (!hydrated) {
    return (
      <div className={s.root}>
        <header className={s.header}>
          <div className={s.title}>
            Compose appraisal report <span className={s.titleHint}>loading…</span>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.title}>
          Compose appraisal report
          <span className={s.titleHint}>{report.slug || "no slug yet"}</span>
        </div>
        <div className={s.actions}>
          <div className={s.tabs} role="group" aria-label="View">
            <button
              type="button"
              className={view === "form" ? s.tabBtnActive : s.tabBtn}
              onClick={() => setView("form")}
            >
              Form
            </button>
            <button
              type="button"
              className={view === "preview" ? s.tabBtnActive : s.tabBtn}
              onClick={() => setView("preview")}
            >
              Preview
            </button>
          </div>
          <button type="button" className={s.btnGhost} onClick={loadPreset}>
            Load Noosa Parade
          </button>
          <button type="button" className={s.btnGhost} onClick={reset}>
            Reset
          </button>
          <button type="button" className={s.btnGhost} onClick={downloadTs}>
            Download .ts
          </button>
          <button type="button" className={s.btnPrimary} onClick={copyTs}>
            Copy data file
          </button>
        </div>
      </header>

      {toast ? <div className={s.toast}>{toast}</div> : null}

      <div className={s.layout}>
        {/* ── FORM PANE ─────────────────────────────────────────── */}
        <div className={s.formPane} data-hidden={view === "preview"}>
          {/* quick nav */}
          <nav className={s.quickNav}>
            {[
              ["meta", "Meta"],
              ["vendor", "Vendor"],
              ["agent", "Agent"],
              ["property", "Property"],
              ["market", "Market"],
              ["comps", "Comps"],
              ["buyer", "Buyer"],
              ["marketing", "Marketing"],
              ["approach", "Approach"],
              ["agency", "Agency"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={s.quickNavLink}
                onClick={() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* ── META ─────────────────────────────────── */}
          <section id="sec-meta" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Meta</div>
            </div>
            <div className={`${s.row} ${s.row3}`}>
              <Field
                label="Slug"
                value={report.slug}
                onChange={(v) => setReport((r) => ({ ...r, slug: v }))}
                hint="Auto-generated from address; safe to override."
              />
              <Field
                label="Ref"
                value={report.ref}
                onChange={(v) => setReport((r) => ({ ...r, ref: v }))}
                placeholder="MX-AP-0517"
              />
              <Field
                label="Prepared on"
                value={report.preparedOn}
                onChange={(v) => setReport((r) => ({ ...r, preparedOn: v }))}
                placeholder="26 May 2026"
              />
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <SelectField<BrandTone>
                label="Accent"
                value={(report.accent ?? "ember") as BrandTone}
                options={TONES}
                onChange={(v) => setReport((r) => ({ ...r, accent: v }))}
              />
            </div>
          </section>

          {/* ── VENDOR ────────────────────────────────── */}
          <section id="sec-vendor" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Vendor</div>
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="First name"
                value={report.vendor.firstName}
                onChange={(v) => setVendor("firstName", v)}
              />
              <Field
                label="Last name"
                value={report.vendor.lastName}
                onChange={(v) => setVendor("lastName", v)}
              />
              <Field
                label="Full name (display)"
                value={report.vendor.fullName}
                onChange={(v) => setVendor("fullName", v)}
                placeholder="Catherine & David Hoffmann"
                wide
              />
            </div>
          </section>

          {/* ── AGENT ─────────────────────────────────── */}
          <section id="sec-agent" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Assigned agent</div>
              <button type="button" className={s.sectionAction} onClick={loadJames}>
                Use James Whitlam
              </button>
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <Field label="Name" value={report.agent.name} onChange={(v) => setAgent("name", v)} />
              <Field label="Role" value={report.agent.role} onChange={(v) => setAgent("role", v)} />
              <Field label="Phone" value={report.agent.phone} onChange={(v) => setAgent("phone", v)} />
              <Field label="Email" value={report.agent.email} onChange={(v) => setAgent("email", v)} />
            </div>
            <TextField
              label="Bio"
              rows={3}
              value={report.agent.bio}
              onChange={(v) => setAgent("bio", v)}
            />
            <div className={s.label} style={{ marginTop: 8, marginBottom: 6 }}>
              Recent campaigns
            </div>
            <Repeated
              items={report.agent.recent}
              onChange={(items) => setAgent("recent", items)}
              newItem={() => ({ addr: "", price: "", days: 0 })}
              addLabel="Add campaign"
              min={1}
              max={6}
              render={(it, set) => (
                <div className={`${s.row} ${s.row3}`}>
                  <Field label="Address" value={it.addr} onChange={(v) => set({ ...it, addr: v })} />
                  <Field label="Price" value={it.price} onChange={(v) => set({ ...it, price: v })} />
                  <NumField label="Days" value={it.days} onChange={(v) => set({ ...it, days: v })} />
                </div>
              )}
            />
          </section>

          {/* ── PROPERTY ──────────────────────────────── */}
          <section id="sec-property" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Property</div>
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="Street"
                value={report.property.street}
                onChange={(v) => updateAddress("street", v)}
                placeholder="17/140 Noosa Parade"
              />
              <Field
                label="Suburb"
                value={report.property.suburb}
                onChange={(v) => updateAddress("suburb", v)}
                placeholder="Noosaville"
              />
            </div>
            <div className={`${s.row} ${s.row3}`}>
              <Field
                label="State"
                value={report.property.state}
                onChange={(v) => setProperty("state", v)}
                placeholder="QLD"
              />
              <Field
                label="Postcode"
                value={report.property.postcode}
                onChange={(v) => setProperty("postcode", v)}
                placeholder="4566"
              />
              <Field
                label="Type"
                value={report.property.type}
                onChange={(v) => setProperty("type", v)}
                placeholder="Apartment · river-front"
              />
            </div>
            <div className={`${s.row} ${s.row3}`}>
              <NumField label="Beds" value={report.property.beds} onChange={(v) => setProperty("beds", v)} min={0} />
              <NumField label="Baths" value={report.property.baths} onChange={(v) => setProperty("baths", v)} min={0} />
              <NumField label="Car spaces" value={report.property.cars} onChange={(v) => setProperty("cars", v)} min={0} />
              <Field
                label="Internal m²"
                value={report.property.internal ?? ""}
                onChange={(v) => setProperty("internal", v || undefined)}
                placeholder="162m² · leave blank if unknown"
              />
              <Field
                label="Outdoor m²"
                value={report.property.outdoor ?? ""}
                onChange={(v) => setProperty("outdoor", v || undefined)}
                placeholder="38m² · leave blank if N/A"
              />
            </div>
            <TextField
              label="Overture (one-line serif quote)"
              rows={2}
              value={report.property.overture}
              onChange={(v) => setProperty("overture", v)}
              placeholder="A quiet position on the river, a confident place in the market."
            />
            <TextField
              label="Blurb (1–2 sentences)"
              rows={3}
              value={report.property.blurb}
              onChange={(v) => setProperty("blurb", v)}
            />
            <div className={s.label} style={{ marginTop: 8, marginBottom: 6 }}>
              Feature bullets (aim for 6)
            </div>
            <Repeated
              items={report.property.features}
              onChange={(items) => setProperty("features", items)}
              newItem={() => ""}
              addLabel="Add feature"
              min={1}
              max={8}
              render={(it, set) => (
                <Field label="Feature" value={it} onChange={(v) => set(v)} />
              )}
            />
          </section>

          {/* ── MARKET ────────────────────────────────── */}
          <section id="sec-market" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Market</div>
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="Segment"
                value={report.market.segment}
                onChange={(v) => setMarket("segment", v)}
                placeholder="Apartments · 3 bed"
              />
              <Field
                label="Market suburb"
                value={report.market.suburb}
                onChange={(v) => setMarket("suburb", v)}
                placeholder="Noosaville"
              />
            </div>

            <div className={s.trendCard}>
              <div className={s.trendHead}>Series generator — set latest + trend, the form fills the charts</div>
              <div className={`${s.row} ${s.row2}`} style={{ marginBottom: 0 }}>
                <NumField
                  label="Median latest ($M)"
                  step={0.01}
                  value={trend.medianLatest}
                  onChange={(v) => setTrend((t) => ({ ...t, medianLatest: v }))}
                />
                <NumField
                  label="Median YoY (%)"
                  step={0.1}
                  value={trend.medianYoy}
                  onChange={(v) => setTrend((t) => ({ ...t, medianYoy: v }))}
                />
                <NumField
                  label="DOM 8 quarters ago (days)"
                  value={trend.domStart}
                  onChange={(v) => setTrend((t) => ({ ...t, domStart: v }))}
                />
                <NumField
                  label="DOM latest (days)"
                  value={trend.domEnd}
                  onChange={(v) => setTrend((t) => ({ ...t, domEnd: v }))}
                />
                <NumField
                  label="Enquiries latest (per month)"
                  value={trend.enqLatest}
                  onChange={(v) => setTrend((t) => ({ ...t, enqLatest: v }))}
                />
                <NumField
                  label="Enquiries YoY (%)"
                  step={0.1}
                  value={trend.enqYoy}
                  onChange={(v) => setTrend((t) => ({ ...t, enqYoy: v }))}
                />
              </div>
            </div>

            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="Median (display)"
                value={report.market.median}
                onChange={(v) => setMarket("median", v)}
                placeholder="$1.65M"
              />
              <Field
                label="Median change (display)"
                value={report.market.medianChange}
                onChange={(v) => setMarket("medianChange", v)}
                placeholder="+8.2% YoY"
              />
              <NumField
                label="DOM (display, days)"
                value={report.market.dom}
                onChange={(v) => setMarket("dom", v)}
              />
              <Field
                label="DOM change (display)"
                value={report.market.domChange}
                onChange={(v) => setMarket("domChange", v)}
                placeholder="−9 days vs metro"
              />
              <NumField
                label="Enquiries (display)"
                value={report.market.searchVolume}
                onChange={(v) => setMarket("searchVolume", v)}
              />
              <Field
                label="Enquiries change (display)"
                value={report.market.searchChange}
                onChange={(v) => setMarket("searchChange", v)}
                placeholder="+38% YoY"
              />
            </div>
            <div className={`${s.row} ${s.row3}`}>
              <NumField
                label="Active listings"
                value={report.market.inventory}
                onChange={(v) => setMarket("inventory", v)}
              />
              <NumField
                label="Months supply"
                step={0.1}
                value={report.market.monthsSupply}
                onChange={(v) => setMarket("monthsSupply", v)}
              />
              <NumField
                label="Clearance rate (%)"
                value={report.market.clearanceRate}
                onChange={(v) => setMarket("clearanceRate", v)}
              />
            </div>
            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="Indicative range — low"
                value={report.market.indicativeRangeLow}
                onChange={(v) => setMarket("indicativeRangeLow", v)}
                placeholder="$1.78M"
              />
              <Field
                label="Indicative range — high"
                value={report.market.indicativeRangeHigh}
                onChange={(v) => setMarket("indicativeRangeHigh", v)}
                placeholder="$1.92M"
              />
            </div>
          </section>

          {/* ── COMPS ─────────────────────────────────── */}
          <section id="sec-comps" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Comparable sales</div>
            </div>
            <Repeated
              items={report.comps}
              onChange={(items) => setReport((r) => ({ ...r, comps: items }))}
              newItem={() => blankComp()}
              addLabel="Add comp"
              min={1}
              max={8}
              render={(c, set) => (
                <Fragment>
                  <div className={`${s.row} ${s.row2}`}>
                    <Field label="Address" value={c.addr} onChange={(v) => set({ ...c, addr: v })} />
                    <Field label="Suburb" value={c.suburb} onChange={(v) => set({ ...c, suburb: v })} />
                  </div>
                  <div className={`${s.row} ${s.row3}`}>
                    <Field label="Price" value={c.price} onChange={(v) => set({ ...c, price: v })} />
                    <Field label="Sold" value={c.sold} onChange={(v) => set({ ...c, sold: v })} placeholder="Apr 2026" />
                    <NumField label="Days (0 to hide)" value={c.days ?? 0} onChange={(v) => set({ ...c, days: v > 0 ? v : undefined })} />
                  </div>
                  <div className={`${s.row} ${s.row3}`}>
                    <NumField label="Beds" value={c.beds} onChange={(v) => set({ ...c, beds: v })} />
                    <NumField label="Baths" value={c.baths} onChange={(v) => set({ ...c, baths: v })} />
                    <NumField label="Cars" value={c.cars} onChange={(v) => set({ ...c, cars: v })} />
                  </div>
                </Fragment>
              )}
            />
          </section>

          {/* ── BUYER ─────────────────────────────────── */}
          <section id="sec-buyer" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Buyer</div>
            </div>
            <TextField
              label="Headline (one sentence)"
              rows={2}
              value={report.buyer.headline}
              onChange={(v) => setBuyer("headline", v)}
            />
            <div className={`${s.row} ${s.row2}`}>
              <Field
                label="Sample note"
                value={report.buyer.sampleNote}
                onChange={(v) => setBuyer("sampleNote", v)}
                placeholder="n = 286"
              />
            </div>
            <div className={s.label} style={{ marginTop: 8, marginBottom: 6 }}>
              Segments (should sum to ~100)
            </div>
            <Repeated
              items={report.buyer.segments}
              onChange={(items) => setBuyer("segments", items)}
              newItem={() => ({ pct: 0, label: "", detail: "", tone: "fern" as BrandTone })}
              addLabel="Add segment"
              min={1}
              max={6}
              render={(seg, set) => (
                <Fragment>
                  <div className={`${s.row} ${s.row3}`}>
                    <NumField label="%" value={seg.pct} onChange={(v) => set({ ...seg, pct: v })} />
                    <Field label="Label" value={seg.label} onChange={(v) => set({ ...seg, label: v })} />
                    <SelectField<BrandTone>
                      label="Tone"
                      value={seg.tone}
                      options={TONES}
                      onChange={(v) => set({ ...seg, tone: v })}
                    />
                  </div>
                  <TextField
                    label="Detail"
                    rows={2}
                    value={seg.detail}
                    onChange={(v) => set({ ...seg, detail: v })}
                  />
                </Fragment>
              )}
            />
            <div className={s.label} style={{ marginTop: 14, marginBottom: 6 }}>
              Database signals (3)
            </div>
            <Repeated
              items={report.buyer.signals}
              onChange={(items) => setBuyer("signals", items)}
              newItem={() => ({ k: "", v: "" })}
              addLabel="Add signal"
              min={1}
              max={5}
              render={(sig, set) => (
                <div className={`${s.row} ${s.row2}`}>
                  <Field label="Big number" value={sig.k} onChange={(v) => set({ ...sig, k: v })} placeholder="1,840" />
                  <Field label="Text" value={sig.v} onChange={(v) => set({ ...sig, v: v })} wide />
                </div>
              )}
            />
          </section>

          {/* ── MARKETING ─────────────────────────────── */}
          <section id="sec-marketing" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Marketing</div>
            </div>
            <Repeated
              items={report.marketing.inclusions}
              onChange={(items) => setMarketing("inclusions", items)}
              newItem={() => ({ c: "", v: "" })}
              addLabel="Add inclusion"
              min={3}
              max={12}
              render={(it, set) => (
                <div className={`${s.row} ${s.row2}`}>
                  <Field
                    label="Category"
                    value={it.c}
                    onChange={(v) => set({ ...it, c: v })}
                    placeholder="Photography"
                  />
                  <Field label="Value" value={it.v} onChange={(v) => set({ ...it, v: v })} />
                </div>
              )}
            />
            <div className={`${s.row} ${s.row2}`} style={{ marginTop: 12 }}>
              <Field
                label="Indicative budget"
                value={report.marketing.indicativeBudget}
                onChange={(v) => setMarketing("indicativeBudget", v)}
                placeholder="$11,400"
              />
            </div>
          </section>

          {/* ── APPROACH (template) ───────────────────── */}
          <section id="sec-approach" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Approach (template)</div>
            </div>
            <details>
              <summary className={s.hint} style={{ cursor: "pointer", marginBottom: 12 }}>
                Show / edit the three phases
              </summary>
              <Repeated
                items={report.approach}
                onChange={(items) => setReport((r) => ({ ...r, approach: items }))}
                newItem={() => ({
                  n: "0?",
                  phase: "",
                  weeks: "",
                  summary: "",
                  detail: "",
                  items: ["", "", "", ""],
                  tone: "linen" as const,
                })}
                addLabel="Add phase"
                min={1}
                max={4}
                render={(p, set) => (
                  <Fragment>
                    <div className={`${s.row} ${s.row3}`}>
                      <Field label="n" value={p.n} onChange={(v) => set({ ...p, n: v })} />
                      <Field label="Phase" value={p.phase} onChange={(v) => set({ ...p, phase: v })} />
                      <Field label="Weeks" value={p.weeks} onChange={(v) => set({ ...p, weeks: v })} />
                      <SelectField
                        label="Tone"
                        value={p.tone}
                        options={PHASE_TONES}
                        onChange={(v) => set({ ...p, tone: v as typeof p.tone })}
                      />
                    </div>
                    <TextField
                      label="Summary (italic)"
                      rows={2}
                      value={p.summary}
                      onChange={(v) => set({ ...p, summary: v })}
                    />
                    <TextField
                      label="Detail"
                      rows={3}
                      value={p.detail}
                      onChange={(v) => set({ ...p, detail: v })}
                    />
                    <div className={s.label} style={{ marginTop: 6 }}>Checklist items</div>
                    <Repeated
                      items={p.items}
                      onChange={(items) => set({ ...p, items })}
                      newItem={() => ""}
                      addLabel="Add item"
                      min={1}
                      max={6}
                      render={(it, ss) => <Field label="Item" value={it} onChange={(v) => ss(v)} />}
                    />
                  </Fragment>
                )}
              />
            </details>
          </section>

          {/* ── AGENCY (template) ─────────────────────── */}
          <section id="sec-agency" className={s.section}>
            <div className={s.sectionHead}>
              <div className={s.sectionTitle}>Agency (template)</div>
            </div>
            <details>
              <summary className={s.hint} style={{ cursor: "pointer", marginBottom: 12 }}>
                Show / edit the stats, rating and testimonial
              </summary>
              <div className={s.label} style={{ marginBottom: 6 }}>Collective stats (4)</div>
              <Repeated
                items={report.agency.collective}
                onChange={(items) =>
                  setReport((r) => ({ ...r, agency: { ...r.agency, collective: items } }))
                }
                newItem={() => ({ n: "", l: "" })}
                addLabel="Add stat"
                min={1}
                max={6}
                render={(c, set) => (
                  <div className={`${s.row} ${s.row2}`}>
                    <Field label="Number" value={c.n} onChange={(v) => set({ ...c, n: v })} />
                    <Field label="Label" value={c.l} onChange={(v) => set({ ...c, l: v })} />
                  </div>
                )}
              />
              <div className={`${s.row} ${s.row4}`} style={{ marginTop: 14 }}>
                <Field
                  label="Rating score"
                  value={report.agency.rating.score}
                  onChange={(v) =>
                    setReport((r) => ({ ...r, agency: { ...r.agency, rating: { ...r.agency.rating, score: v } } }))
                  }
                />
                <Field
                  label="Rating /"
                  value={report.agency.rating.outOf}
                  onChange={(v) =>
                    setReport((r) => ({ ...r, agency: { ...r.agency, rating: { ...r.agency.rating, outOf: v } } }))
                  }
                />
                <NumField
                  label="Stars"
                  value={report.agency.rating.stars}
                  onChange={(v) =>
                    setReport((r) => ({ ...r, agency: { ...r.agency, rating: { ...r.agency.rating, stars: v } } }))
                  }
                />
                <Field
                  label="Reviews label"
                  value={report.agency.rating.reviews}
                  onChange={(v) =>
                    setReport((r) => ({ ...r, agency: { ...r.agency, rating: { ...r.agency.rating, reviews: v } } }))
                  }
                />
              </div>
              <div className={`${s.row}`} style={{ marginTop: 14 }}>
                <Field
                  label="Testimonial overline"
                  value={report.agency.testimonial.note}
                  onChange={(v) =>
                    setReport((r) => ({
                      ...r,
                      agency: { ...r.agency, testimonial: { ...r.agency.testimonial, note: v } },
                    }))
                  }
                />
              </div>
              <TextField
                label="Quote"
                rows={4}
                value={report.agency.testimonial.quote}
                onChange={(v) =>
                  setReport((r) => ({
                    ...r,
                    agency: { ...r.agency, testimonial: { ...r.agency.testimonial, quote: v } },
                  }))
                }
              />
              <div className={`${s.row} ${s.row2}`}>
                <Field
                  label="Author"
                  value={report.agency.testimonial.author}
                  onChange={(v) =>
                    setReport((r) => ({
                      ...r,
                      agency: { ...r.agency, testimonial: { ...r.agency.testimonial, author: v } },
                    }))
                  }
                />
                <Field
                  label="Detail line"
                  value={report.agency.testimonial.detail}
                  onChange={(v) =>
                    setReport((r) => ({
                      ...r,
                      agency: { ...r.agency, testimonial: { ...r.agency.testimonial, detail: v } },
                    }))
                  }
                />
              </div>
            </details>
          </section>
        </div>

        {/* ── PREVIEW PANE ──────────────────────────────────────── */}
        <div className={s.previewPane} data-hidden={view === "form"}>
          <div className={s.previewInner}>
            <ReportProvider value={previewCtx}>
              {(
                [
                  ["Welcome", Welcome],
                  ["The market", TheMarket],
                  ["Your buyer", YourBuyer],
                  ["Approach", Approach],
                  ["Marketing", MarketingSection],
                  ["Your team", YourTeam],
                  ["Why Max.", WhyMax],
                  ["Next steps", NextSteps],
                ] as const
              ).map(([label, Section]) => (
                <div key={label} className={s.previewSection}>
                  <div className={s.previewLabel}>{label}</div>
                  <Section report={fullReport} />
                </div>
              ))}
            </ReportProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
