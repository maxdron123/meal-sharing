"use client";
import styles from "./page.module.css";
import MealCard from "@/components/MealList/MealCard";
import ReservationForm from "@/components/MealList/ReservationForm";
import ReviewForm from "@/components/MealList/ReviewForm";
import { useState, useEffect } from "react";
import api from "@/utils/api";

export default function MealDetailPage({ params }) {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(api(`/meals/${params.id}`));
        if (res.ok) {
          const mealData = await res.json();
          setMeal(mealData);
        }
      } catch (error) {
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
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
            single={true}
            onReservationToggle={() => {
              if (showReservation) {
                setShowReservation(false);
              } else {
                setShowReservation(true);
                setShowReview(false); // Close review form
              }
            }}
            onReviewToggle={() => {
              if (showReview) {
                setShowReview(false);
              } else {
                setShowReview(true);
                setShowReservation(false); // Close reservation form
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
              <ReservationForm mealId={meal.id} />
            </div>
          )}

          {showReview && (
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Leave a Review</h3>
              <ReviewForm mealId={meal.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
