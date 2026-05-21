import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/wp/mock";

// App-like register (§4): stateful, interaction-rich pages (/buy, /properties/:slug).
// Header here is always solid (rendered per-page). Footer is shared.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      {children}
      <Footer settings={settings} />
    </>
  );
}
