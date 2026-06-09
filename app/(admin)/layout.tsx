import type { Metadata } from "next";
import type { ReactNode } from "react";

// Admin tools live under an obscure URL with no marketing/app chrome. Never indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
