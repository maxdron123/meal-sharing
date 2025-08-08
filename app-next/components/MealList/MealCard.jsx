"use client";
import styles from "./MealCard.module.css";
import Link from "next/link";
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import ReviewForm from "./ReviewForm";
import Rating from "./Rating";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "../Auth/AuthModal";

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
  showNotification,
}) {
  const [internalShowReservation, setInternalShowReservation] = useState(false);
  const [internalShowReview, setInternalShowReview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { user, isAuthenticated } = useAuth();

  // Helper function to get image source
  const getImageSrc = (raw) => {
    const PLACEHOLDER = "/placeholder-meal.svg";
    if (!raw || typeof raw !== "string") return PLACEHOLDER;
    const image = raw.trim();

    // 1. Already a complete data URL
    if (image.startsWith("data:image/")) return image;

    // 2. External absolute URL (http / https)
    if (/^https?:\/\//i.test(image)) return image;

    // 3. Any static/public path (served from Next.js public/)
    // Covers: /images/..., /uploads/... or other leading slash assets
    if (image.startsWith("/")) return image;

    // 4. Heuristic: raw base64 without prefix (avoid false positives)
    //    - long enough
    //    - only base64 charset
    //    - no whitespace
    if (
      image.length > 80 &&
      /^[A-Za-z0-9+/=]+$/.test(image) &&
      !image.includes(" ") &&
      !image.includes("\\n")
    ) {
      // Basic content sniff: JPEG usually starts with /9j/, PNG with iVBOR
      const imageType = image.startsWith("/9j/")
        ? "jpeg"
        : image.startsWith("iVBOR")
        ? "png"
        : "jpeg"; // default
      return `data:image/${imageType};base64,${image}`;
    }

    // 5. Fallback
    return PLACEHOLDER;
  };

  // Use internal state for non-single cards, external state for single cards
  const isShowingReservation = single
    ? showReservation
    : internalShowReservation;
  const isShowingReview = single ? showReview : internalShowReview;

  const handleReservationToggle = () => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    if (single && onReservationToggle) {
      onReservationToggle();
    } else {
      setInternalShowReservation(!internalShowReservation);
    }
  };

  const handleReviewToggle = () => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    if (single && onReviewToggle) {
      onReviewToggle();
    } else {
      setInternalShowReview(!internalShowReview);
    }
  };

  if (!single) {
    return (
      <div className={styles.card}>
        <img className={styles.img} src={getImageSrc(image)} alt={title} />
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
        <img className={styles.img} src={getImageSrc(image)} alt={title} />
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
              : isAuthenticated
              ? "Reserve"
              : "Sign In to Reserve"}
          </button>
          <button className={styles.button} onClick={handleReviewToggle}>
            {isShowingReview
              ? "Close Review"
              : isAuthenticated
              ? "Leave Review"
              : "Sign In to Review"}
          </button>
        </div>
      </div>

      {/* For non-single cards, show forms below */}
      {!single && internalShowReservation && (
        <ReservationForm mealId={id} showNotification={showNotification} />
      )}
      {!single && internalShowReview && (
        <ReviewForm mealId={id} showNotification={showNotification} />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
}
