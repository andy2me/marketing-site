// Max Property — Insights article body renderer.
// Walks the typed Block[] from lib/insights/types and renders each variant. Drop-cap is
// applied to the FIRST paragraph in the list (editorial convention from the handoff).

import type { Block, ParagraphBlock } from "@/lib/insights/types";
import { MiniBarChart } from "./MiniBarChart";
import s from "./Article.module.css";

function renderParagraph(p: ParagraphBlock, withDropCap: boolean) {
  if (!p.link) {
    return (
      <p className={s.p}>
        {withDropCap ? <span className={s.dropCap}>{p.text.charAt(0)}</span> : null}
        {withDropCap ? p.text.slice(1) : p.text}
      </p>
    );
  }
  // Inline-link case — {{link}} marker in text is replaced with the link.
  const [pre, post] = p.text.split("{{link}}");
  return (
    <p className={s.p}>
      {withDropCap && pre.length > 0 ? <span className={s.dropCap}>{pre.charAt(0)}</span> : null}
      {withDropCap && pre.length > 0 ? pre.slice(1) : pre}
      <a className={s.bodyLink} href={p.link.href}>
        {p.link.label}
      </a>
      {post ?? ""}
    </p>
  );
}

export function ArticleBody({ body }: { body: Block[] }) {
  const firstParaIdx = body.findIndex((b) => b.kind === "p");
  return (
    <>
      {body.map((block, i) => {
        switch (block.kind) {
          case "p":
            return (
              <div key={i}>
                {renderParagraph(block, i === firstParaIdx)}
              </div>
            );
          case "h2":
            return (
              <h2 key={i} id={block.id} className={s.h2}>
                {block.text}
              </h2>
            );
          case "blockquote":
            return (
              <blockquote key={i} className={s.quote}>
                {block.text}
              </blockquote>
            );
          case "chart":
            return (
              <div key={i} className={s.chart}>
                <div className={`overline ${s.chartHead}`}>{block.overline}</div>
                <MiniBarChart series={block.series} accent={block.accent} />
                <div className={s.chartCaption}>{block.caption}</div>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
