"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevron } from "@/components/icons";
import s from "./properties.module.css";

export function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  includeAny = true,
  neutral = false,
}: {
  label: string;
  value: string | null;
  options: string[];
  onSelect: (value: string | null) => void;
  /** Show an "Any" reset item at the top (filters); off for sort. */
  includeAny?: boolean;
  /** Neutral styling regardless of value (used for the Sort control). */
  neutral?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = !neutral && !!value;

  return (
    <div ref={ref} className={s.ddWrap}>
      <button
        type="button"
        className={`${s.ddTrigger} ${active ? s.ddActive : ""}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={s.ddLabel}>
          {label}
          {active ? ":" : ""}
        </span>
        {(active || neutral) && value ? <span className={s.ddValue}>{value}</span> : null}
        <IconChevron />
      </button>

      {open && (
        <div className={s.ddMenu} role="listbox">
          {includeAny && (
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={`${s.ddItem} ${!value ? s.ddItemActive : ""}`}
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
            >
              Any
            </button>
          )}
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              className={`${s.ddItem} ${o === value ? s.ddItemActive : ""}`}
              onClick={() => {
                onSelect(o);
                setOpen(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
