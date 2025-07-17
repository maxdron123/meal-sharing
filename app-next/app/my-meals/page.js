"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateMealForm from "./CreateMealForm";
import Notification from "@/components/Notification/Notification";
import { useNotification } from "@/hooks/useNotification";
import styles from "./my-meals.module.css";

export default function MyMealsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchUserMeals();
    }
  }, [user]);

  const fetchUserMeals = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";

      let response = await fetch(`${backendUrl}/api/meals/user/${user.id}`);

      if (!response.ok) {
        response = await fetch(`${backendUrl}/api/meals`);

        if (response.ok) {
          const allMeals = await response.json();
          const userMeals = allMeals.filter(
            (meal) => meal.created_by === user.id
          );
          setMeals(userMeals);
        } else {
          setMeals([]);
        }
      } else {
        const data = await response.json();
        setMeals(data);
      }

      setLoadingMeals(false);
    } catch (error) {
      setMeals([]);
      setLoadingMeals(false);
    }
  };

  const handleMealCreated = (newMeal) => {
    fetchUserMeals();
    setShowCreateForm(false);
  };

  const handleDeleteMeal = async (mealId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this meal? This action cannot be undone."
      )
    ) {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";
        const response = await fetch(`${backendUrl}/api/meals/${mealId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMeals(meals.filter((meal) => meal.id !== mealId));
          showNotification("Meal deleted successfully!", "success");
        } else {
          showNotification("Failed to delete meal. Please try again.", "error");
        }
      } catch (error) {
        showNotification("Failed to delete meal. Please try again.", "error");
      }
    }
  };

  const getImageSrc = (image) => {
    if (!image) return "/placeholder-meal.svg";

    if (image.startsWith("data:image/")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return image;
    }

    return "/placeholder-meal.svg";
  };

  const getStatusColor = (meal) => {
    const currentReservations = meal.current_reservations || 0;
    const maxReservations = meal.max_reservations || 0;

    if (meal.status === "full" || currentReservations >= maxReservations) {
      return "#f44336";
    }
    if (currentReservations === 0) {
      return "#ff9800";
    }
    return "#4caf50";
  };

  const getStatusText = (meal) => {
    const currentReservations = meal.current_reservations || 0;
    const maxReservations = meal.max_reservations || 0;

    if (meal.status === "full" || currentReservations >= maxReservations) {
      return "Full";
    }
    if (currentReservations === 0) {
      return "No Reservations";
    }
    return "Active";
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
          <p>Please log in to manage your meals</p>
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
          <h1>My Meals</h1>
          <p>Create and manage your meal offerings for the community</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{meals.length}</span>
              <span className={styles.statLabel}>Total Meals</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {meals.reduce(
                  (sum, meal) => sum + (meal.current_reservations || 0),
                  0
                )}
              </span>
              <span className={styles.statLabel}>Reservations</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className={styles.createBtn}
          >
            <span className={styles.createIcon}>➕</span>
            Create New Meal
          </button>
        </div>
      </div>

      {showCreateForm && (
        <CreateMealForm
          onMealCreated={handleMealCreated}
          onCancel={() => setShowCreateForm(false)}
          showNotification={showNotification}
        />
      )}

      {loadingMeals ? (
        <div className={styles.loadingMeals}>
          <div className={styles.spinner}></div>
          <p>Loading your meals...</p>
        </div>
      ) : meals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h2>No Meals Created Yet</h2>
          <p>Start sharing your culinary creations with the community!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className={styles.createFirstBtn}
          >
            Create Your First Meal
          </button>
        </div>
      ) : (
        <div className={styles.mealsList}>
          {meals.map((meal) => (
            <div key={meal.id} className={styles.mealCard}>
              <div className={styles.mealImage}>
                <img
                  src={getImageSrc(meal.image)}
                  alt={meal.title}
                  onError={(e) => {
                    e.target.src = "/placeholder-meal.svg";
                  }}
                />
                <div
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(meal) }}
                >
                  {getStatusText(meal)}
                </div>
              </div>

              <div className={styles.mealContent}>
                <h3>{meal.title}</h3>
                <p className={styles.description}>{meal.description}</p>

                <div className={styles.mealInfo}>
                  <span className={styles.location}>� {meal.location}</span>
                  <span className={styles.price}>
                    ${meal.price ? Number(meal.price).toFixed(2) : "0.00"}
                  </span>
                </div>

                <div className={styles.availability}>
                  <span className={styles.spotsInfo}>
                    👥 {meal.current_reservations || 0}/
                    {meal.max_reservations || 0} spots booked
                  </span>
                </div>

                <div className={styles.mealActions}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.viewBtn}>Reservations</button>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
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
          <Link href="/my-reservations" className={styles.quickLink}>
            <span className={styles.linkIcon}>📅</span>
            <span>My Reservations</span>
          </Link>
          <Link href="/my-reviews" className={styles.quickLink}>
            <span className={styles.linkIcon}>⭐</span>
            <span>My Reviews</span>
          </Link>
          <Link href="/meals" className={styles.quickLink}>
            <span className={styles.linkIcon}>🍽️</span>
            <span>Browse All Meals</span>
          </Link>
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
