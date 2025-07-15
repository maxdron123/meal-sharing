import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🍽️</span>
              <span className={styles.logoText}>Meal Sharing</span>
            </div>
            <p className={styles.description}>
              Bringing people together through shared meals and experiences.
            </p>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.linksTitle}>Quick Links</h4>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>
                About
              </Link>
              <Link href="/contact" className={styles.link}>
                Contact
              </Link>
              <Link href="/privacy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={styles.link}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Meal Sharing. All rights reserved.
          </span>
          <div className={styles.socialLinks}>
            <span className={styles.socialText}>Follow us:</span>
            <a href="#" className={styles.socialLink}>
              📘
            </a>
            <a href="#" className={styles.socialLink}>
              📷
            </a>
            <a href="#" className={styles.socialLink}>
              🐦
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
