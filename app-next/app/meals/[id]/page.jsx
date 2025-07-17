"use client";
import styles from "./page.module.css";
import MealCard from "@/components/MealList/MealCard";
import ReservationForm from "@/components/MealList/ReservationForm";
import ReviewForm from "@/components/MealList/ReviewForm";
import ReviewCard from "@/components/MealList/ReviewCard";
import Rating from "@/components/MealList/Rating";
import Notification from "@/components/Notification/Notification";
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";
import api from "@/utils/api";

export default function MealDetailPage({ params }) {
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const { notification, showNotification, hideNotification } =
    useNotification();

  const fetchMeal = async () => {
    try {
      const res = await fetch(api(`/meals/${params.id}`));
      if (res.ok) {
        const mealData = await res.json();
        setMeal(mealData);
      }
    } catch (error) {
      setError("Failed to load meal details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(api(`/meals/${params.id}/reviews`));
      if (res.ok) {
        const reviewsData = await res.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      setError("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
    fetchReviews();
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>Loading meal details...</div>;
  }

  if (!meal) {
    return <div className={styles.notFound}>Meal not found.</div>;
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.mealCardWrapper}>
          <MealCard
            id={meal.id}
            title={meal.title}
            description={meal.description}
            image={meal.image}
            location={meal.location}
            price={meal.price}
            availableSpots={meal.available_spots}
            maxReservations={meal.max_reservations}
            averageRating={meal.average_rating}
            reviewCount={meal.review_count}
            single={true}
            onReservationToggle={() => {
              if (showReservation) {
                setShowReservation(false);
              } else {
                setShowReservation(true);
                setShowReview(false);
              }
            }}
            onReviewToggle={() => {
              if (showReview) {
                setShowReview(false);
              } else {
                setShowReview(true);
                setShowReservation(false);
              }
            }}
            showReservation={showReservation}
            showReview={showReview}
          />
        </div>

        <div className={styles.formsWrapper}>
          {showReservation && (
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Make a Reservation</h3>
              <ReservationForm
                mealId={meal.id}
                showNotification={showNotification}
                onSuccess={() => {
                  fetchMeal();
                  setShowReservation(false);
                }}
              />
            </div>
          )}

          {showReview && (
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Leave a Review</h3>
              <ReviewForm
                mealId={meal.id}
                showNotification={showNotification}
                onSuccess={() => {
                  fetchMeal();
                  fetchReviews();
                  setShowReview(false);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.reviewsSection}>
          <h2>Reviews</h2>
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className={styles.noReviews}>
              No reviews yet. Be the first to leave a review!
            </p>
          )}
        </div>
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
