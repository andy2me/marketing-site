import styles from "./StatRow.module.css";

export type Stat = { value: string; label: string; sub?: string };

/** Equally-spaced statistic row, framed top/bottom with vertical dividers. Serif numerals. */
export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div
      className={styles.row}
      style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
    >
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.value}>{s.value}</div>
          <div className={styles.label}>{s.label}</div>
          {s.sub ? <div className={styles.sub}>{s.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
