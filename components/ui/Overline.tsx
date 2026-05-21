import type { CSSProperties, ReactNode } from "react";

export function Overline({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={["overline", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
