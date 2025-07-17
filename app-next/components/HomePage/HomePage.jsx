"use client";
import Link from "next/link";
import MealsList from "../MealList/MealList";
import Notification from "../Notification/Notification";
import { useNotification } from "@/hooks/useNotification";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { notification, showNotification, hideNotification } =
    useNotification();

  return (
    <div className={styles.background}>
      <MealsList full={false} showNotification={showNotification} />
      <div className={styles.buttonWrapper}>
        <Link href="/meals" className={styles.showMoreButton}>
          Show more
        </Link>
      </div>

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={hideNotification}
        duration={notification?.duration}
      />
    </div>
  );
}
