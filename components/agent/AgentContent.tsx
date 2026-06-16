// Stacked content rows — mono kicker + serif title + read time + up-right arrow.
// Server component.

import Link from "next/link";
import { IconArrowUR } from "@/components/icons";
import type { ArticleCard } from "@/lib/insights/types";
import s from "./agent.module.css";

export function AgentContent({ items }: { items: ArticleCard[] }) {
  if (items.length === 0) return null;

  return (
    <section className={s.section}>
      <div className="overline">§ Guides & notes</div>
      <h2 className={s.sectionH2}>Words from the patch.</h2>
      <div className={s.contentList}>
        {items.map((item) => (
          <Link key={item.slug} href={`/insights/${item.slug}`} className={s.contentRow}>
            <div className={s.contentRowLeft}>
              <div className={s.contentKicker}>{item.category}</div>
              <h3 className={s.contentTitle}>{item.title}</h3>
            </div>
            <div className={s.contentRowRight}>
              <span>{item.readLabel}</span>
              <span className={s.contentArrow} aria-hidden>
                <IconArrowUR />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
