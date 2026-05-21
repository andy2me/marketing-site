import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <Container>
        <div className={styles.inner}>
          <div className="overline">404</div>
          <h1 className={styles.title}>Page not found.</h1>
          <p className={styles.note}>The page you&rsquo;re after doesn&rsquo;t exist or has moved.</p>
          <div className={styles.cta}>
            <Link className="btn btn-primary" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
