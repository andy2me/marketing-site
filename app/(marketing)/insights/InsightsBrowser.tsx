"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconSearch, IconArrowR } from "@/components/icons";
import s from "./insights.module.css";

export type Article = {
  cat: string;
  title: string;
  date: string;
  read: string;
  author: string;
  slug: string;
};

const PAGE = 6;
const ORDER = ["Market", "Selling", "Buying", "Locations", "Design", "Investors"];

export function InsightsBrowser({ articles }: { articles: Article[] }) {
  const [cat, setCat] = useState("All");
  const [visible, setVisible] = useState(PAGE);

  const counts: Record<string, number> = { All: articles.length };
  articles.forEach((a) => {
    counts[a.cat] = (counts[a.cat] ?? 0) + 1;
  });
  const cats = ["All", ...ORDER.filter((c) => counts[c])];

  const filtered = cat === "All" ? articles : articles.filter((a) => a.cat === cat);
  const shown = filtered.slice(0, visible);

  const select = (c: string) => {
    setCat(c);
    setVisible(PAGE);
  };

  return (
    <>
      {/* TODO(§10): sync active category to ?category= for shareable filters. */}
      <section className={s.catBar}>
        <div className="container">
          <div className={s.catBarInner}>
            <div className={s.catChips}>
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${s.catChip} ${cat === c ? s.catChipActive : ""}`}
                  aria-pressed={cat === c}
                  onClick={() => select(c)}
                >
                  {c} <span className={s.catCount}>{counts[c]}</span>
                </button>
              ))}
            </div>
            <div className={s.search}>
              <IconSearch /> <span>Search the journal…</span>
            </div>
          </div>
        </div>
      </section>

      <section className={s.grid}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={s.empty}>No articles in this category yet.</div>
          ) : (
            <>
              <div className={s.gridCols}>
                {shown.map((a) => (
                  <Link key={a.slug} href={`/insights/${a.slug}`} className={s.card}>
                    <ImageSlot ratio="5/4" className={s.cardMedia} />
                    <div className={s.cardBlock}>
                      <div className={`overline ${s.cardCat}`}>{a.cat}</div>
                      <h3 className={s.cardTitle}>{a.title}</h3>
                      <div className={s.cardMeta}>
                        <span>{a.author}</span>
                        <span>·</span>
                        <span>{a.date}</span>
                        <span>·</span>
                        <span>{a.read}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {visible < filtered.length && (
                <div className={s.loadMore}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    onClick={() => setVisible((v) => v + PAGE)}
                  >
                    Load more articles <IconArrowR />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
