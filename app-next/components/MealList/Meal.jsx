import React from "react";
import styles from "./Meal.module.css";

export default function Meal({ title, description, image }) {
  return (
    <div className={styles.card}>
      <img className={styles.img} src={image} alt={title} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.button}>Share</button>
        <button className={styles.button}>Learn More</button>
      </div>
    </div>
  );
}
