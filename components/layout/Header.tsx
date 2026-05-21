"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "./Wordmark";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <header className={`${styles.header} ${solid ? styles.solid : styles.transparent}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" aria-label="Max Property — home" className={styles.brand}>
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
        {/* TODO(§12 responsive): hamburger drawer (focus-trapped, Esc to close) below 768. */}
      </div>
    </header>
  );
}
