"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { IconMenu, IconClose } from "@/components/icons";
import type { NavItem } from "@/lib/wp/types";
import styles from "./Header.module.css";

type HeaderProps = {
  /** Render transparent over a dark hero (marketing register). Solid otherwise. */
  transparent?: boolean;
  /** Active nav label, for the ember underline. */
  current?: string | null;
  nav: NavItem[];
};

export function Header({ transparent = false, current = null, nav }: HeaderProps) {
  // Sticky-on-scroll: transparent over the hero → solid with a shadow once scrolled.
  // (Not in the prototype — added per code handoff §5 / design handoff interactions.)
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Esc + lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const solid = !transparent || scrolled;

  return (
    <header className={`${styles.header} ${solid ? styles.solid : styles.transparent}`}>
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          aria-label="Max Property — home"
          className={styles.brand}
          onClick={() => setDrawerOpen(false)}
        >
          <Wordmark light={!solid} size={26} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.label ? "page" : undefined}
              className={[
                styles.link,
                current === item.label ? styles.active : "",
                !solid ? styles.linkOnDark : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/sell#appraisal" className={`btn btn-primary btn-sm ${styles.cta}`}>
            Request an Appraisal
          </Link>
        </nav>

        <button
          type="button"
          className={`${styles.menuBtn} ${!solid ? styles.menuBtnOnDark : ""}`}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="primary-nav-drawer"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          {drawerOpen ? <IconClose size={18} /> : <IconMenu size={20} />}
        </button>
      </div>

      {drawerOpen && (
        <div
          id="primary-nav-drawer"
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
        >
          <button
            type="button"
            className={styles.drawerScrim}
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className={styles.drawerPanel}>
            <ul className={styles.drawerList}>
              {nav.map((item: NavItem) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current === item.label ? "page" : undefined}
                    className={`${styles.drawerLink} ${current === item.label ? styles.drawerLinkActive : ""}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/sell#appraisal"
              className={`btn btn-primary btn-lg ${styles.drawerCta}`}
              onClick={() => setDrawerOpen(false)}
            >
              Request an Appraisal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
