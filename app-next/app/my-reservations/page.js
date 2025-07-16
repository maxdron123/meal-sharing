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
      // TODO: Fetch user's reservations from backend
      // Simulating data for now
      setTimeout(() => {
        setReservations([
          {
            id: 1,
            mealTitle: "Italian Pasta Night",
            mealImage: "/api/placeholder/300/200",
            date: "2025-07-20",
            time: "19:00",
            guests: 2,
            status: "confirmed",
            location: "Downtown Kitchen",
            price: 25.99,
          },
          {
            id: 2,
            mealTitle: "Sushi Workshop",
            mealImage: "/api/placeholder/300/200",
            date: "2025-07-25",
            time: "18:30",
            guests: 1,
            status: "pending",
            location: "Zen Cooking Studio",
            price: 45.0,
          },
          {
            id: 3,
            mealTitle: "BBQ & Grill Master Class",
            mealImage: "/api/placeholder/300/200",
            date: "2025-07-15",
            time: "17:00",
            guests: 4,
            status: "completed",
            location: "Backyard Bistro",
            price: 35.5,
          },
        ]);
        setLoadingReservations(false);
      }, 1000);
    }
  }, [user]);

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
                  src={reservation.mealImage}
                  alt={reservation.mealTitle}
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
                  <h3>{reservation.mealTitle}</h3>
                  <div
                    className={styles.status}
                    style={{ color: getStatusColor(reservation.status) }}
                  >
                    {getStatusIcon(reservation.status)}{" "}
                    {reservation.status.charAt(0).toUpperCase() +
                      reservation.status.slice(1)}
                  </div>
                </div>

                <div className={styles.reservationDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📅</span>
                    <span>{formatDate(reservation.date)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>🕐</span>
                    <span>{reservation.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>👥</span>
                    <span>
                      {reservation.guests}{" "}
                      {reservation.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📍</span>
                    <span>{reservation.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>💰</span>
                    <span>${reservation.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles.reservationActions}>
                  {reservation.status === "confirmed" && (
                    <>
                      <button className={styles.actionBtn}>View Details</button>
                      <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === "pending" && (
                    <>
                      <button className={styles.actionBtn}>View Details</button>
                      <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === "completed" && (
                    <>
                      <button className={styles.actionBtn}>View Details</button>
                      <Link href="/my-reviews" className={styles.actionBtn}>
                        Write Review
                      </Link>
                    </>
                  )}
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
