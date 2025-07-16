"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./reservations.module.css";

export default function MyReservationsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchUserReservations();
    }
  }, [user]);

  const fetchUserReservations = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";

      let response = await fetch(
        `${backendUrl}/api/reservations/user/${user.id}`
      );

      if (!response.ok) {
        response = await fetch(`${backendUrl}/api/reservations`);

        if (response.ok) {
          const allReservations = await response.json();
          const userReservations = allReservations.filter(
            (reservation) => reservation.user_id === user.id
          );
          setReservations(userReservations);
        } else {
          setReservations([]);
        }
      } else {
        const data = await response.json();
        setReservations(data);
      }

      setLoadingReservations(false);
    } catch (error) {
      setReservations([]);
      setLoadingReservations(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";
        const response = await fetch(
          `${backendUrl}/api/reservations/${reservationId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setReservations((prevReservations) =>
            prevReservations.filter(
              (reservation) => reservation.id !== reservationId
            )
          );
          alert("Reservation cancelled successfully!");
        } else {
          alert("Failed to cancel reservation. Please try again.");
        }
      } catch (error) {
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  const handleViewMealDetails = (mealId) => {
    if (mealId) {
      router.push(`/meals/${mealId}`);
    } else {
      alert("Meal details not available");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "📅";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "completed":
        return "#2196f3";
      case "cancelled":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Access Denied</h2>
          <p>Please log in to view your reservations</p>
          <Link href="/" className={styles.homeLink}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>My Reservations</h1>
          <p>Manage your meal bookings and upcoming dining experiences</p>
        </div>
        <Link href="/meals" className={styles.bookNewBtn}>
          Book New Meal
        </Link>
      </div>

      {loadingReservations ? (
        <div className={styles.loadingReservations}>
          <div className={styles.spinner}></div>
          <p>Loading your reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h2>No Reservations Yet</h2>
          <p>
            You haven't made any meal reservations yet. Start exploring our
            amazing meals!
          </p>
          <Link href="/meals" className={styles.exploreBtn}>
            Explore Meals
          </Link>
        </div>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={styles.reservationCard}>
              <div className={styles.mealImage}>
                <img
                  src={
                    reservation.meal_image ||
                    reservation.image ||
                    "/placeholder-meal.jpg"
                  }
                  alt={reservation.meal_title || reservation.title || "Meal"}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f0f0f0"/>
                          <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="18">Meal Image</text>
                        </svg>
                      `)}`;
                  }}
                />
              </div>

              <div className={styles.reservationInfo}>
                <div className={styles.reservationHeader}>
                  <h3>
                    {reservation.meal_title || reservation.title || "Meal"}
                  </h3>
                  <div className={styles.reservationId}>
                    Reservation #{reservation.id}
                  </div>
                </div>

                <div className={styles.reservationDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📅</span>
                    <span>{formatDate(reservation.created_date)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>👥</span>
                    <span>
                      {reservation.number_of_guests}{" "}
                      {reservation.number_of_guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>👤</span>
                    <span>{reservation.contact_name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📧</span>
                    <span>{reservation.contact_email}</span>
                  </div>
                  {reservation.meal_location && (
                    <div className={styles.detailItem}>
                      <span className={styles.icon}>📍</span>
                      <span>{reservation.meal_location}</span>
                    </div>
                  )}
                  {reservation.meal_price && (
                    <div className={styles.detailItem}>
                      <span className={styles.icon}>💰</span>
                      <span>
                        ${Number(reservation.meal_price).toFixed(2)} per person
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.reservationActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleViewMealDetails(reservation.meal_id)}
                  >
                    View Meal Details
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                    onClick={() => handleCancelReservation(reservation.id)}
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.quickLinks}>
        <h3>Quick Links</h3>
        <div className={styles.linkGrid}>
          <Link href="/profile" className={styles.quickLink}>
            <span className={styles.linkIcon}>👤</span>
            <span>My Profile</span>
          </Link>
          <Link href="/my-reviews" className={styles.quickLink}>
            <span className={styles.linkIcon}>⭐</span>
            <span>My Reviews</span>
          </Link>
          <Link href="/meals" className={styles.quickLink}>
            <span className={styles.linkIcon}>🍽️</span>
            <span>Browse Meals</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
