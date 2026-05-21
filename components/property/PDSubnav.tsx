"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import s from "./detail.module.css";

export function PDSubnav({
  sections,
  refId,
}: {
  sections: { id: string; label: string }[];
  refId: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((sec) => document.getElementById(sec.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className={s.subnav}>
      <Container className={s.subnavInner}>
        <div className={s.subnavTabs}>
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`${s.subnavTab} ${active === sec.id ? s.subnavActive : ""}`}
              aria-current={active === sec.id ? "true" : undefined}
            >
              {sec.label}
            </a>
          ))}
        </div>
        <div className={s.subnavMeta}>
          <span>ID #{refId}</span>
          <span>·</span>
          <a href="#" className={s.subnavLink}>
            Print PDF
          </a>
        </div>
      </Container>
    </div>
  );
}
