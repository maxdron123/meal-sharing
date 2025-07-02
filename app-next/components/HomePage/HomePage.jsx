"use  client";
import Link from "next/link";
import MealsList from "../MealList/MealList";
import styles from "./HomePage.module.css";
export default function HomePage() {
  return (
    <div className={styles.background}>
      <MealsList full={false} />
      <div className={styles.buttonWrapper}>
        <Link href="/meals" className={styles.showMoreButton}>
          Show more
        </Link>
      </div>
    </div>
  );
}
