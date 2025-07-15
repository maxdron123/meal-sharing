"use client";
import styles from "./MealCard.module.css";
import Link from "next/link";
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import ReviewForm from "./ReviewForm";

export default function MealCard({
  id,
  title,
  description,
  image,
  location,
  price,
  availableSpots,
  maxReservations,
  single,
}) {
  const [showReservation, setShowReservation] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (!single) {
    return (
      <div className={styles.card}>
        <img className={styles.img} src={image} alt={title} />
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.info}>
          <span className={styles.location}>{location}</span>
          <span className={styles.price}>€{price}</span>
        </div>
        <div className={styles.availability}>
          <span
            className={`${styles.spotsLeft} ${
              availableSpots === 0
                ? styles.spotsEmpty
                : availableSpots <= 3
                ? styles.spotsLow
                : styles.spotsGood
            }`}
          >
            {availableSpots > 0
              ? `${availableSpots} spots left`
              : "Fully booked"}
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.button}>Share</button>
          <Link href={`/meals/${id}`} className={styles.button}>
            View Details
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.singleCard}>
      <img className={styles.img} src={image} alt={title} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.info}>
        <span className={styles.location}>{location}</span>
        <span className={styles.price}>€{price}</span>
      </div>
      <div className={styles.availability}>
        <span
          className={`${styles.spotsLeft} ${
            availableSpots === 0
              ? styles.spotsEmpty
              : availableSpots <= 3
              ? styles.spotsLow
              : styles.spotsGood
          }`}
        >
          {availableSpots > 0 ? `${availableSpots} spots left` : "Fully booked"}
        </span>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${
            availableSpots === 0 ? styles.buttonDisabled : ""
          }`}
          onClick={() => setShowReservation((prev) => !prev)}
          disabled={availableSpots === 0}
        >
          {availableSpots === 0
            ? "Fully Booked"
            : showReservation
            ? "Close Reservation"
            : "Reserve"}
        </button>
        <button
          className={styles.button}
          onClick={() => setShowReview((prev) => !prev)}
        >
          {showReview ? "Close Review" : "Leave Review"}
        </button>
      </div>
      {showReservation && <ReservationForm mealId={id} />}
      {showReview && <ReviewForm mealId={id} />}
    </div>
  );
}
