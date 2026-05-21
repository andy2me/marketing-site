import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "ghost-dark";
type Size = "sm" | "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...rest
}: Props) {
  const cls = ["btn", `btn-${variant}`, size !== "md" ? `btn-${size}` : null, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a className={cls} href={href} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
