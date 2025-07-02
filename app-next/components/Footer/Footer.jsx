import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <span>
          © {new Date().getFullYear()} Meal Sharing. All rights reserved.
        </span>
      </div>
      <div className={styles.links}>
        <a href="/about" className={styles.link}>
          About
        </a>
        <a href="/contact" className={styles.link}>
          Contact
        </a>
        <a href="/privacy" className={styles.link}>
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
