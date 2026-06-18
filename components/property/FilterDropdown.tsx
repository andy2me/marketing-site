"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setPos({ top: rect.bottom + 4, left: rect.left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const active = !neutral && !!value;

  return (
    <div className={s.ddWrap}>
      <button
        ref={triggerRef}
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

      {open && mounted && pos
        ? createPortal(
            <div
              ref={menuRef}
              className={s.ddMenu}
              role="listbox"
              style={{ position: "fixed", top: pos.top, left: pos.left }}
            >
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
