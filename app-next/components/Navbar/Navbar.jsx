"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">🍽️ Meal Sharing</Link>
      </div>
      <h1>Welcome to Meal Sharing!</h1>

      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span className={styles.menuIcon}>&#9776;</span>
      </button>
      <div className={`${styles.links} ${menuOpen ? styles.show : ""}`}>
        <Link
          href="/"
          className={styles.link}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/meals"
          className={styles.link}
          onClick={() => setMenuOpen(false)}
        >
          Meals
        </Link>
      </div>
    </nav>
  );
}
