import type { ElementType, ReactNode } from "react";

export function Container({
  as: As = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <As className={["container", className].filter(Boolean).join(" ")}>{children}</As>;
}
