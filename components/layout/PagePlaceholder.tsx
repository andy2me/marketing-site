import { Header } from "./Header";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/wp/mock";
import styles from "./PagePlaceholder.module.css";

/**
 * Foundation-slice placeholder for routes not yet built. Wires routing + the solid Header
 * so the IA is navigable; each template gets implemented in its build-order stage (§16).
 */
export async function PagePlaceholder({
  title,
  current,
  note,
}: {
  title: string;
  current?: string;
  note?: string;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header nav={settings.nav} current={current} />
      <main className={styles.main}>
        <Container>
          <div className={styles.inner}>
            <div className="overline">Phase 2 · In build</div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.note}>
              {note ??
                "This template is part of the Max Property build. It is stubbed in the foundation slice and gets implemented in its build-order stage."}
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
