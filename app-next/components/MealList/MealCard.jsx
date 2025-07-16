"use client";
import styles from "./MealCard.module.css";
import Link from "next/link";
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import ReviewForm from "./ReviewForm";
import Rating from "./Rating";

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
  onReservationToggle,
  onReviewToggle,
  showReservation,
  showReview,
  averageRating,
  reviewCount,
}) {
  const [internalShowReservation, setInternalShowReservation] = useState(false);
  const [internalShowReview, setInternalShowReview] = useState(false);

  // Use internal state for non-single cards, external state for single cards
  const isShowingReservation = single
    ? showReservation
    : internalShowReservation;
  const isShowingReview = single ? showReview : internalShowReview;

  const handleReservationToggle = () => {
    if (single && onReservationToggle) {
      onReservationToggle();
    } else {
      setInternalShowReservation(!internalShowReservation);
    }
  };

  const handleReviewToggle = () => {
    if (single && onReviewToggle) {
      onReviewToggle();
    } else {
      setInternalShowReview(!internalShowReview);
    }
  };

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

        {/* Compact rating display for list cards */}
        <div className={styles.compactRating}>
          <Rating
            rating={averageRating || 0}
            reviewCount={reviewCount || 0}
            showCount={false}
          />
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
    <>
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

        {/* Rating display for single card */}
        <div className={styles.ratingSection}>
          <Rating
            rating={averageRating || 0}
            reviewCount={reviewCount || 0}
            showCount={true}
          />
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
          <button
            className={`${styles.button} ${
              availableSpots === 0 ? styles.buttonDisabled : ""
            }`}
            onClick={handleReservationToggle}
            disabled={availableSpots === 0}
          >
            {availableSpots === 0
              ? "Fully Booked"
              : isShowingReservation
              ? "Close Reservation"
              : "Reserve"}
          </button>
          <button className={styles.button} onClick={handleReviewToggle}>
            {isShowingReview ? "Close Review" : "Leave Review"}
          </button>
        </div>
      </div>

      {/* For non-single cards, show forms below */}
      {!single && internalShowReservation && <ReservationForm mealId={id} />}
      {!single && internalShowReview && <ReviewForm mealId={id} />}
    </>
  );
}
