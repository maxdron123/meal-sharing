"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateMealForm from "./CreateMealForm";
import styles from "./my-meals.module.css";

export default function MyMealsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      // Get user's meals from backend
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";

      // First try the user-specific endpoint
      let response = await fetch(`${backendUrl}/api/meals/user/${user.id}`);

      // If that fails, fallback to all meals and filter client-side
      if (!response.ok) {
        console.log("User-specific endpoint failed, trying all meals...");
        response = await fetch(`${backendUrl}/api/meals`);

        if (response.ok) {
          const allMeals = await response.json();
          // Filter meals by user ID on the client side
          const userMeals = allMeals.filter(
            (meal) => meal.created_by === user.id
          );
          setMeals(userMeals);
        } else {
          console.error("Failed to fetch meals from backend");
          setMeals([]);
        }
      } else {
        const data = await response.json();
        setMeals(data);
      }

      setLoadingMeals(false);
    } catch (error) {
      console.error("Error fetching meals:", error);
      // No fallback data - show empty state if error occurs
      setMeals([]);
      setLoadingMeals(false);
    }
  };

  const handleMealCreated = (newMeal) => {
    // Refresh the meal list to show the newly created meal
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
          // Remove meal from state
          setMeals(meals.filter((meal) => meal.id !== mealId));
          console.log("Meal deleted successfully");
        } else {
          console.error("Failed to delete meal from backend");
          alert("Failed to delete meal. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting meal:", error);
        alert("Failed to delete meal. Please try again.");
      }
    }
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
                  src={meal.image}
                  alt={meal.title}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f0f0f0"/>
                        <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="18">Meal Image</text>
                      </svg>
                    `)}`;
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
    </div>
  );
}
