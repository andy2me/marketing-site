import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/wp/mock";

// Marketing register (§4). Editorial pages; the Header is rendered per-page because
// transparency over a dark hero is page-specific. Footer is shared here.
export default async function MarketingLayout({
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
