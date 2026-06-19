import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { fontVariables } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxproperty.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Max Property — Estate Agents, Sunshine Coast",
    template: "%s · Max Property",
  },
  description:
    "Boutique estate agents on the Sunshine Coast. Personalised service, trusted expertise — your outcome drives our approach.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Max Property",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={fontVariables}>
      <GoogleTagManager gtmId="GTM-PHTG3D6N" />
      <body>{children}</body>
    </html>
  );
}
