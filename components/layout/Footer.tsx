import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Overline } from "@/components/ui/Overline";
import { IconInstagram, IconFacebook, IconYouTube } from "@/components/icons";
import type { SiteSettings } from "@/lib/wp/types";
import styles from "./Footer.module.css";

const dim = { color: "rgba(244,237,229,.5)" };

export function Footer({ settings }: { settings: SiteSettings }) {
  const { office, social, footer, nav } = settings;
  const telHref = `tel:${office.phone.replace(/\s+/g, "")}`;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <Wordmark light size={32} />
            <p className={styles.tagline}>{footer.tagline}</p>
            <div className={styles.social}>
              {social.instagram && (
                <a href={social.instagram} aria-label="Instagram">
                  <IconInstagram />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} aria-label="Facebook">
                  <IconFacebook />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} aria-label="YouTube">
                  <IconYouTube />
                </a>
              )}
            </div>
          </div>

          <div>
            <Overline style={dim}>Navigate</Overline>
            <ul className={styles.list}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Overline style={dim}>Office</Overline>
            <ul className={styles.list}>
              {office.addressLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                <a href={telHref}>{office.phone}</a>
              </li>
              <li>{office.hours}</li>
            </ul>
          </div>

          <div>
            <Overline style={dim}>Stay in the loop</Overline>
            <p className={styles.newsletterBlurb}>{footer.newsletterBlurb}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© Max Property · All rights reserved</div>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
