"use client";

import MealsList from "@/components/MealList/MealList";
import Notification from "@/components/Notification/Notification";
import { useNotification } from "@/hooks/useNotification";
import styles from "./page.module.css";

export default function MealsPage() {
  const { notification, showNotification, hideNotification } =
    useNotification();

  return (
    <div className={styles.background}>
      <MealsList full={true} showNotification={showNotification} />

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={hideNotification}
        duration={notification?.duration}
      />
    </div>
  );
}
