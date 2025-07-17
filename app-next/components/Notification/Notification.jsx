"use client";

import { useEffect, useState } from "react";
import styles from "./Notification.module.css";

export default function Notification({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        isVisible ? styles.show : styles.hide
      }`}
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </div>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeBtn}
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
