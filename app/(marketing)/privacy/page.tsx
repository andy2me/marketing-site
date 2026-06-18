import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/wp/mock";
import s from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Max Property Collective collects, uses, and protects personal information shared through maxproperty.au.",
  alternates: { canonical: "/privacy" },
};
export const revalidate = 86400;

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header nav={settings.nav} />
      <main className={s.main}>
        <Container>
          <div className="overline">§ Legal</div>
          <h1 className={s.title}>Privacy Policy</h1>
          <p className={s.updated}>Last updated: 14 September 2025</p>

          <p className={s.intro}>
            Max Property Collective respects your privacy and is committed to protecting personal
            information shared through this website, maxproperty.au.
          </p>

          <section className={s.section}>
            <h2>1. Information we collect</h2>
            <p>We gather two types of data:</p>
            <ul>
              <li>
                <strong>Voluntarily provided:</strong> Name, email, phone number, and other details
                entered into website forms powered by HubSpot.
              </li>
              <li>
                <strong>Automatically collected:</strong> IP address, browser type, device
                information, referral pages, and visit timestamps.
              </li>
            </ul>
          </section>

          <section className={s.section}>
            <h2>2. Tracking and analytics tools</h2>
            <p>We use:</p>
            <ul>
              <li>HubSpot Forms for contact collection</li>
              <li>Google Analytics for anonymised visitor behaviour tracking</li>
              <li>Facebook Pixel for advertising campaign measurement</li>
            </ul>
            <p>
              These tools employ cookies or similar technologies, manageable through your browser
              settings.
            </p>
          </section>

          <section className={s.section}>
            <h2>3. How we use your information</h2>
            <p>Data serves to:</p>
            <ul>
              <li>Respond to enquiries</li>
              <li>Improve website functionality</li>
              <li>Analyse traffic patterns</li>
              <li>Personalise advertising</li>
              <li>Meet legal obligations</li>
            </ul>
          </section>

          <section className={s.section}>
            <h2>4. Data sharing and disclosure</h2>
            <p>
              Personal information is not sold or rented. Sharing occurs only with service providers
              (HubSpot, Google, Facebook) and regulatory authorities when legally required.
            </p>
          </section>

          <section className={s.section}>
            <h2>5. No logged-in state or comments</h2>
            <p>
              This website lacks user accounts, login functionality, or public comment features.
            </p>
          </section>

          <section className={s.section}>
            <h2>6. Data retention</h2>
            <p>
              Information is retained only as long as necessary for the purposes stated above, or
              longer if required by law.
            </p>
          </section>

          <section className={s.section}>
            <h2>7. Your privacy choices</h2>
            <p>
              You can disable Google Analytics tracking, adjust Facebook ad preferences, or manage
              cookies through your browser settings.
            </p>
          </section>

          <section className={s.section}>
            <h2>8. Security</h2>
            <p>
              Reasonable technical and organisational protections safeguard personal information.
            </p>
          </section>

          <section className={s.section}>
            <h2>9. Changes to this privacy policy</h2>
            <p>Updates will be posted here with revised dates.</p>
          </section>

          <section className={s.section}>
            <h2>10. Contact us</h2>
            <p>
              Questions? Email <a href="mailto:hello@maxproperty.au">hello@maxproperty.au</a>.
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}
