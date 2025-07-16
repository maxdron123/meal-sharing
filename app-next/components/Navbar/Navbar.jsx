"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import AuthButton from "../Auth/AuthButton";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>Meal Sharing</span>
        </Link>
      </div>

      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <div
          className={`${styles.hamburger} ${
            menuOpen ? styles.hamburgerOpen : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div className={`${styles.links} ${menuOpen ? styles.show : ""}`}>
        <Link
          href="/"
          className={styles.link}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.linkIcon}>🏠</span>
          Home
        </Link>
        <Link
          href="/meals"
          className={styles.link}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.linkIcon}>🍽️</span>
          Meals
        </Link>

        <div className={styles.authSection}>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
