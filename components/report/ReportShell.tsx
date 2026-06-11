"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import type { Report } from "@/lib/report/types";
import { SECTIONS, sectionByRoute } from "@/lib/report/types";
import {
  IconMenu,
  IconClose,
  IconArrowL,
  IconArrowR,
  IconChevronRight,
  IconCheck,
  IconLock,
  IconPhone,
  IconMail,
} from "@/components/icons";
import s from "./shell.module.css";

function ProgressRing({ pct, size = 32 }: { pct: number; size?: number }) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (c * pct) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={s.ringSvg}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="2.5" style={{ stroke: "var(--white-mist-300)" }} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth="2.5"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ stroke: "var(--color-action)" }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="9" fontWeight="500" style={{ fontFamily: "var(--font-mono), monospace", fill: "var(--color-text-strong)" }}>
        {pct}%
      </text>
    </svg>
  );
}

export function ReportShell({ report, children }: { report: Report; children: ReactNode }) {
  const params = useParams<{ slug: string; section?: string }>();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const base = `/property/report/${report.slug}`;
  const resolved = params.section ? sectionByRoute(params.section) : null;
  const idx = resolved?.index ?? 0;
  const current = SECTIONS[idx];
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];
  const total = SECTIONS.length;
  const pct = Math.round(((idx + 1) / total) * 100);
  const vendorFirst = report.vendor.fullName.split(/\s|&/)[0];
  const agentFirst = report.agent.name.split(" ")[0];
  const href = (i: number) => `${base}/${SECTIONS[i].route}`;

  // Reset scroll on section (route) change (syncing an external system — the scroll position).
  // The sheet is closed via its links' onClick, not here, to avoid setState-in-effect.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  // Print route renders the proposal end-to-end for download — strip the shell chrome entirely.
  // Early return AFTER all hooks so rules-of-hooks stays satisfied.
  if (pathname?.endsWith("/print")) {
    return <>{children}</>;
  }

  return (
    <div className={s.root}>
      {/* ── Desktop top bar ─────────────────────────────────────────── */}
      <header className={s.dTopBar}>
        <div className={s.dBrand}>
          <span className={s.wordmark}>
            Max<span className={s.dot}>.</span>
          </span>
          <span className={s.dKicker}>Appraisal</span>
        </div>
        <div className={s.dCrumb}>
          <span className={s.dCrumbLock}>
            <IconLock /> Privately shared with {vendorFirst}
          </span>
          <span className={s.dCrumbSep}>·</span>
          <span className={s.dCrumbAddr}>
            {report.property.street}, {report.property.suburb}
          </span>
          <span className={s.dCrumbSep}>·</span>
          <span className={s.dCrumbPill}>
            {current.n}/{String(total).padStart(2, "0")} · {current.title.toLowerCase()}
          </span>
        </div>
        <div className={s.dActions}>
          <div className={s.dPreparedFor}>
            <div className="overline">Prepared for</div>
            <div className={s.dVendor}>{report.vendor.fullName}</div>
          </div>
          <Link className={s.dContactBtn} href={`${base}/your-team`}>
            <IconPhone /> Contact {agentFirst}
          </Link>
        </div>
      </header>

      {/* ── Mobile header ───────────────────────────────────────────── */}
      <header className={s.mHeader}>
        <div className={s.mHeaderTop}>
          <div className={s.mBrand}>
            <span className={s.wordmark}>
              Max<span className={s.dot}>.</span>
            </span>
            <span className={s.mKicker}>Appraisal · {vendorFirst}</span>
          </div>
          <button
            type="button"
            className={s.mSectionPill}
            aria-label="Open sections"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((o) => !o)}
          >
            {current.n} / {String(total).padStart(2, "0")}
            <IconMenu size={16} />
          </button>
        </div>
        <div className={s.mProgress}>
          <div className={s.progressStrip} aria-hidden>
            {SECTIONS.map((_, i) => (
              <span
                key={i}
                className={[s.progressDot, i <= idx ? s.progressDotOn : ""].join(" ")}
                style={{ opacity: i === idx ? 1 : i < idx ? 0.7 : 1 }}
              />
            ))}
          </div>
          <div className={s.mProgressLabels}>
            <span className={s.mSectionTitle}>
              {current.title}
              <span className={s.dot}>.</span>
            </span>
            <span className={s.mRoute}>/{current.route}</span>
          </div>
        </div>
      </header>

      {/* ── Layout: desktop sidebar + content; mobile single column ──── */}
      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.sideHead}>
            <div className="overline">Vendor proposal</div>
            <div className={s.sideVendor}>
              {report.vendor.fullName}
              <span className={s.dot}>.</span>
            </div>
            <div className={s.sideProgress}>
              <ProgressRing pct={pct} />
              <div className={s.sideProgressText}>
                <div>
                  {idx + 1} of {total} sections
                </div>
                <div className={s.sideProgressEta}>~ {Math.max(1, total - idx)} min left</div>
              </div>
            </div>
          </div>

          <nav className={s.sideNav} aria-label="Sections">
            <ol className={s.sideList}>
              {SECTIONS.map((sec, i) => {
                const active = i === idx;
                const done = i < idx;
                return (
                  <li key={sec.id}>
                    <Link
                      href={href(i)}
                      className={[s.sideItem, active ? s.sideItemActive : ""].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={[s.sideNum, active ? s.sideNumActive : done ? s.sideNumDone : ""].join(" ")}>
                        {sec.n}
                      </span>
                      <span className={s.sideItemText}>
                        <span className={s.sideItemTitle}>{sec.long}</span>
                        <span className={s.sideItemHint}>{sec.hint}</span>
                      </span>
                      <span className={s.sideItemMark}>
                        {done ? <IconCheck /> : active ? <IconChevronRight /> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className={s.sideAgent}>
            <div className={s.sideAgentCard}>
              <span className={s.sideAgentAvatar} aria-hidden />
              <div>
                <div className="overline">Your agent</div>
                <div className={s.sideAgentName}>{report.agent.name}</div>
                <div className={s.sideAgentRole}>{report.agent.role.split(" · ")[0]}</div>
              </div>
            </div>
            <div className={s.sideAgentBtns}>
              <a className={s.sideMiniBtn} href={`tel:${report.agent.phone.replace(/\s+/g, "")}`}>
                <IconPhone /> Call
              </a>
              <a className={s.sideMiniBtn} href={`mailto:${report.agent.email}`}>
                <IconMail /> Email
              </a>
            </div>
          </div>
        </aside>

        <main className={s.main}>
          <div key={pathname} className={s.content}>
            {children}
          </div>

          {/* Desktop prev/next section nav */}
          <nav className={s.dSectionNav} aria-label="Section navigation">
            {prev ? (
              <Link href={href(idx - 1)} className={s.dNavCard}>
                <div className="overline">← {prev.n} · Previous</div>
                <div className={s.dNavTitle}>{prev.long}</div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={href(idx + 1)} className={`${s.dNavCard} ${s.dNavCardEnd}`}>
                <div className="overline">{next.n} · Next →</div>
                <div className={s.dNavTitle}>{next.long}</div>
              </Link>
            ) : (
              <div className={`${s.dNavCard} ${s.dNavCardEnd} ${s.dNavCardQuiet}`}>
                <div className="overline">End of proposal</div>
                <div className={`${s.dNavTitle} ${s.dNavTitleItalic}`}>Thank you for reading.</div>
              </div>
            )}
          </nav>
        </main>
      </div>

      {/* ── Mobile footer CTA ───────────────────────────────────────── */}
      <div className={s.mFooter}>
        <div className={s.mFooterInner}>
          {prev ? (
            <Link href={href(idx - 1)} className={s.mPrevBtn} aria-label="Previous section">
              <IconArrowL />
            </Link>
          ) : null}
          {next ? (
            <Link href={href(idx + 1)} className={s.mNextBtn}>
              <span className={s.mNextText}>
                <span className={s.mNextKicker}>Next · {next.n}</span>
                <span className={s.mNextLabel}>{next.long}</span>
              </span>
              <span className={s.mNextArrow} aria-hidden>
                <IconArrowR />
              </span>
            </Link>
          ) : (
            <Link href={`${base}/your-team`} className={s.mNextBtn}>
              <span className={s.mNextText}>
                <span className={s.mNextKicker}>End of proposal</span>
                <span className={s.mNextLabel}>Arrange a conversation</span>
              </span>
              <span className={s.mNextArrow} aria-hidden>
                <IconArrowR />
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile section sheet ────────────────────────────────────── */}
      {sheetOpen ? (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label="Sections">
          <button className={s.sheetScrim} aria-label="Close sections" onClick={() => setSheetOpen(false)} />
          <div className={s.sheetPanel}>
            <div className={s.sheetGrip} aria-hidden />
            <div className={s.sheetHead}>
              <div className="overline">Sections · {total}</div>
              <button className={s.sheetClose} aria-label="Close" onClick={() => setSheetOpen(false)}>
                <IconClose />
              </button>
            </div>
            <ol className={s.sheetList}>
              {SECTIONS.map((sec, i) => {
                const active = i === idx;
                const done = i < idx;
                return (
                  <li key={sec.id}>
                    <Link
                      href={href(i)}
                      className={[s.sheetItem, active ? s.sheetItemActive : ""].join(" ")}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setSheetOpen(false)}
                    >
                      <span className={[s.sheetNum, active ? s.sheetNumActive : done ? s.sideNumDone : ""].join(" ")}>
                        {sec.n}
                      </span>
                      <span className={s.sheetItemText}>
                        <span className={s.sheetItemTitle}>{sec.long}</span>
                        <span className={s.sheetItemHint}>{sec.hint}</span>
                      </span>
                      <span className={s.sheetItemMark}>{done ? <IconCheck /> : <IconChevronRight />}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}
