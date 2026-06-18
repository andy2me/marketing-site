// Suburb pill chips. Each chip links to /{suburb-slug} when a hub exists, else
// renders as a span. Server component.

import Link from "next/link";
import { IconPin } from "@/components/icons";
import { getHubSlugs } from "@/lib/suburbs/store";
import s from "./agent.module.css";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export function AgentSuburbs({ patches }: { patches: string[] }) {
  if (patches.length === 0) return null;
  const hubSlugs = new Set(getHubSlugs());

  return (
    <section className={s.suburbsSection}>
      <div className={s.suburbsInner}>
        <div className={`overline ${s.suburbsLabel}`}>§ Patches</div>
        <div className={s.suburbsList}>
          {patches.map((patch) => {
            const slug = slugify(patch);
            const hubExists = hubSlugs.has(slug);
            const inner = (
              <>
                <span className={s.suburbChipIcon} aria-hidden>
                  <IconPin />
                </span>
                {patch}
              </>
            );
            return hubExists ? (
              <Link key={patch} href={`/${slug}`} className={s.suburbChip}>
                {inner}
              </Link>
            ) : (
              <span key={patch} className={s.suburbChip}>
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
