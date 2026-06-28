"use client";

// All-units section — three switchable views (stack | cards | table) and a
// sort affordance. The stack-plan view is the default and the cleverest:
// rows = levels, columns split by river (even) vs garden (odd) aspect, cells
// coloured by status. Drawn from the data array (lib/complexes/store), no
// imported floorplan.
//
// Client component because the view switch + sort + hover lift are all
// stateful. Renders inside the complex profile page; the breadcrumb / hero /
// stats / commentary that wrap it stay server-rendered.

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowR } from "@/components/icons";
import {
  EVENT_VERB,
  STATUS_COLOR_VAR,
  STATUS_RANK,
  type StackPlanRow,
} from "@/lib/complexes/derive";
import type { ComplexUnit, EventStatus } from "@/lib/complexes/types";
import { MetaRow, SectionHead, StatusBadge } from "./Atoms";

type View = "stack" | "cards" | "table";
type SortKey = "number" | "level" | "status" | "beds";

type Props = {
  units: ReadonlyArray<ComplexUnit>;
  rows: ReadonlyArray<StackPlanRow>;
  unitHrefBase: string; // "/property/noosaville/the-islander/"
  totalUnits: number;
};

const LEGEND: ReadonlyArray<readonly [EventStatus, string]> = [
  ["For Sale", "var(--fern)"],
  ["For Rent", "var(--clay)"],
  ["Recently Sold", "var(--white-mist-700)"],
  ["Off Market", "var(--white-mist-400)"],
];

export function UnitsSection({ units, rows, unitHrefBase, totalUnits }: Props) {
  const [view, setView] = useState<View>("stack");
  const [sort, setSort] = useState<SortKey>("number");

  const sortedUnits = useMemo(() => {
    const arr = [...units];
    switch (sort) {
      case "status":
        arr.sort(
          (a, b) =>
            STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
            a.number - b.number,
        );
        break;
      case "beds":
        arr.sort((a, b) => b.beds - a.beds || a.number - b.number);
        break;
      case "level":
        // Level is a string ("G", "1" ..) — rank by row order. Higher first.
        arr.sort((a, b) => {
          const ai = rows.findIndex((r) => r.level === a.level);
          const bi = rows.findIndex((r) => r.level === b.level);
          return ai - bi || a.number - b.number;
        });
        break;
      default:
        arr.sort((a, b) => a.number - b.number);
    }
    return arr;
  }, [units, rows, sort]);

  return (
    <section
      id="units"
      className="container"
      style={{ paddingTop: 80, paddingBottom: 24 }}
    >
      <SectionHead
        over={`All units · ${totalUnits} dwellings`}
        title="Every property in the building."
        sub="One profile per dwelling. A stable URL that deepens with each event — sale, listing or rental."
        action={<ViewSwitch view={view} setView={setView} />}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <Legend />
        {view !== "stack" && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-surface)",
                color: "var(--color-text-primary)",
                fontFamily: "inherit",
                fontSize: 13,
              }}
            >
              <option value="number">Unit number</option>
              <option value="level">Level (high → low)</option>
              <option value="status">Status</option>
              <option value="beds">Bedrooms</option>
            </select>
          </label>
        )}
      </div>

      {view === "stack" && (
        <StackPlan rows={rows} unitHrefBase={unitHrefBase} />
      )}
      {view === "cards" && (
        <UnitCards units={sortedUnits} unitHrefBase={unitHrefBase} />
      )}
      {view === "table" && (
        <UnitTable units={sortedUnits} unitHrefBase={unitHrefBase} />
      )}
    </section>
  );
}

// ── View switch ────────────────────────────────────────────────────────────
function ViewSwitch({
  view,
  setView,
}: {
  view: View;
  setView: (v: View) => void;
}) {
  const opts: ReadonlyArray<readonly [View, string]> = [
    ["stack", "Stack plan"],
    ["cards", "Cards"],
    ["table", "Table"],
  ];
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        padding: 4,
        gap: 4,
        background: "var(--color-bg-subtle)",
        border: "1px solid var(--color-border)",
        borderRadius: 999,
      }}
    >
      {opts.map(([k, label]) => {
        const active = view === k;
        return (
          <button
            key={k}
            role="tab"
            aria-selected={active}
            onClick={() => setView(k)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: active ? "var(--color-bg-inverse)" : "transparent",
              color: active
                ? "var(--color-text-on-dark)"
                : "var(--color-text-secondary)",
              transition: "background 160ms, color 160ms",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
      {LEGEND.map(([label, color]) => (
        <span
          key={label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            color: "var(--color-text-secondary)",
          }}
        >
          <span
            aria-hidden
            style={{ width: 10, height: 10, borderRadius: 3, background: color }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Stack plan ─────────────────────────────────────────────────────────────
// Building schematic — top floor first; garden (odd, south-west) on the left,
// river (even, north-east) on the right; a dashed corridor line down the
// centre. Add or edit a unit in lib/complexes/mock and it lands in the correct
// row automatically thanks to stackPlanRows in derive.ts.
function StackPlan({
  rows,
  unitHrefBase,
}: {
  rows: ReadonlyArray<StackPlanRow>;
  unitHrefBase: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        padding: "28px 28px 24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr 40px 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div />
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-text-secondary)",
            textAlign: "center",
          }}
        >
          South-west · garden
        </div>
        <div />
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-action)",
            textAlign: "center",
          }}
        >
          North-east · river
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((row) => (
          <div
            key={row.level}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr 40px 1fr",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                color: "var(--color-text-strong)",
                textAlign: "right",
                paddingRight: 4,
              }}
            >
              {row.levelLabel}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {row.garden.map((u) => (
                <UnitCell
                  key={u.id}
                  u={u}
                  href={`${unitHrefBase}${u.id}`}
                  hovered={hover === u.number}
                  onHover={setHover}
                />
              ))}
            </div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <div
                title="corridor / lift core"
                style={{
                  width: 2,
                  height: "70%",
                  background:
                    "repeating-linear-gradient(var(--white-mist-300) 0 4px, transparent 4px 8px)",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {row.river.map((u) => (
                <UnitCell
                  key={u.id}
                  u={u}
                  href={`${unitHrefBase}${u.id}`}
                  hovered={hover === u.number}
                  onHover={setHover}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          marginLeft: 76,
          height: 6,
          borderRadius: 3,
          background: "var(--soft-linen-200)",
        }}
      />
      <p
        style={{
          marginTop: 10,
          marginLeft: 76,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.04em",
          color: "var(--color-text-secondary)",
        }}
      >
        187 Gympie Terrace — riverfront elevation
      </p>
    </div>
  );
}

function UnitCell({
  u,
  href,
  hovered,
  onHover,
}: {
  u: ComplexUnit;
  href: string;
  hovered: boolean;
  onHover: (n: number | null) => void;
}) {
  const color = STATUS_COLOR_VAR[u.status];
  const live = u.status !== "Off Market";
  return (
    <Link
      href={href}
      onMouseEnter={() => onHover(u.number)}
      onMouseLeave={() => onHover(null)}
      title={`Unit ${u.number} · ${u.beds}/${u.baths}/${u.car} · ${u.status}`}
      style={{
        position: "relative",
        aspectRatio: "1.6 / 1",
        borderRadius: 8,
        textDecoration: "none",
        border: live ? `1.5px solid ${color}` : "1px solid var(--color-border)",
        background: live
          ? `color-mix(in srgb, ${color} 12%, var(--color-bg-surface))`
          : "var(--color-bg-subtle)",
        display: "grid",
        placeItems: "center",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "var(--shadow-md)" : "none",
        transition: "transform 140ms, box-shadow 140ms",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: live
            ? "var(--color-text-strong)"
            : "var(--color-text-secondary)",
        }}
      >
        {u.number}
      </span>
      {live && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: 999,
            background: color,
          }}
        />
      )}
    </Link>
  );
}

// ── Cards ──────────────────────────────────────────────────────────────────
function UnitCards({
  units,
  unitHrefBase,
}: {
  units: ReadonlyArray<ComplexUnit>;
  unitHrefBase: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))",
        gap: 16,
      }}
    >
      {units.map((u) => (
        <Link
          key={u.id}
          href={`${unitHrefBase}${u.id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: "18px 18px 16px",
            display: "grid",
            gap: 12,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                color: "var(--color-text-strong)",
              }}
            >
              Unit {u.number}
            </span>
            <StatusBadge status={u.status} size="sm" />
          </div>
          <p
            style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
          >
            {u.levelName} · {u.aspect}
          </p>
          <MetaRow beds={u.beds} baths={u.baths} car={u.car} area={u.area} />
          <p
            style={{
              paddingTop: 12,
              borderTop: "1px solid var(--color-border)",
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            {u.lastEvent
              ? `${EVENT_VERB[u.lastEvent.type]} ${u.lastEvent.price} · ${u.lastEvent.date}`
              : "No recent events"}
          </p>
        </Link>
      ))}
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
function UnitTable({
  units,
  unitHrefBase,
}: {
  units: ReadonlyArray<ComplexUnit>;
  unitHrefBase: string;
}) {
  const th = {
    textAlign: "left" as const,
    padding: "12px 16px",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-secondary)",
    fontWeight: 500,
    borderBottom: "1px solid var(--color-border)",
  };
  const td = {
    padding: "14px 16px",
    fontSize: 14,
    color: "var(--color-text-primary)",
    borderBottom: "1px solid var(--color-border)",
  };
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Unit</th>
            <th style={th}>Level</th>
            <th style={th}>Config</th>
            <th style={th}>Internal</th>
            <th style={th}>Aspect</th>
            <th style={th}>Status</th>
            <th style={th}>Last event</th>
            <th style={th} aria-label="open" />
          </tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr
              key={u.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.href = `${unitHrefBase}${u.id}`;
              }}
            >
              <td
                style={{
                  ...td,
                  fontWeight: 500,
                  color: "var(--color-text-strong)",
                }}
              >
                <Link
                  href={`${unitHrefBase}${u.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Unit {u.number}
                </Link>
              </td>
              <td style={td}>{u.levelName}</td>
              <td style={td}>
                {u.beds} · {u.baths} · {u.car}
              </td>
              <td style={td}>{u.area}</td>
              <td style={td}>{u.aspect}</td>
              <td style={td}>
                <StatusBadge status={u.status} size="sm" />
              </td>
              <td style={{ ...td, color: "var(--color-text-secondary)" }}>
                {u.lastEvent
                  ? `${EVENT_VERB[u.lastEvent.type]} ${u.lastEvent.price} · ${u.lastEvent.date}`
                  : "—"}
              </td>
              <td style={{ ...td, color: "var(--color-action)" }}>
                <IconArrowR />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

