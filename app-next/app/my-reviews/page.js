"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./reviews.module.css";

export default function MyReviewsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    stars: 5,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      // TODO: Fetch user's reviews from backend
      // Simulating data for now
      setTimeout(() => {
        setReviews([
          {
            id: 1,
            mealTitle: "Italian Pasta Night",
            mealImage: "/api/placeholder/300/200",
            title: "Amazing authentic experience!",
            description:
              "The pasta was perfectly cooked and the atmosphere was wonderful. The chef was very knowledgeable about Italian cuisine and shared great stories about the recipes.",
            stars: 5,
            dateCreated: "2025-07-16",
            mealDate: "2025-07-15",
          },
          {
            id: 2,
            mealTitle: "Sushi Workshop",
            mealImage: "/api/placeholder/300/200",
            title: "Great learning experience",
            description:
              "Learned so much about sushi making techniques. The instructor was patient and the ingredients were fresh. Would definitely recommend for beginners.",
            stars: 4,
            dateCreated: "2025-07-10",
            mealDate: "2025-07-08",
          },
          {
            id: 3,
            mealTitle: "BBQ & Grill Master Class",
            mealImage: "/api/placeholder/300/200",
            title: "Fun but could be better",
            description:
              "The BBQ techniques were interesting but the venue was a bit crowded. Food was good overall but service could be improved.",
            stars: 3,
            dateCreated: "2025-07-05",
            mealDate: "2025-07-03",
          },
        ]);
        setLoadingReviews(false);
      }, 1000);
    }
  }, [user]);

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditFormData({
      title: review.title,
      description: review.description,
      stars: review.stars,
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditFormData({ title: "", description: "", stars: 5 });
  };

  const handleSaveEdit = (reviewId) => {
    // TODO: Update review in backend
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, ...editFormData } : review
      )
    );
    setEditingReview(null);
    setEditFormData({ title: "", description: "", stars: 5 });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      // TODO: Delete review from backend
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : ""} ${
              interactive ? styles.interactive : ""
            }`}
            onClick={interactive ? () => onChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
          <p>Please log in to view your reviews</p>
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
          <h1>My Reviews</h1>
          <p>
            Share your dining experiences and help others discover great meals
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{reviews.length}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.stars, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0"}
            </span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      {loadingReviews ? (
        <div className={styles.loadingReviews}>
          <div className={styles.spinner}></div>
          <p>Loading your reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⭐</div>
          <h2>No Reviews Yet</h2>
          <p>
            You haven't written any meal reviews yet. Start by booking a meal
            and sharing your experience!
          </p>
          <Link href="/meals" className={styles.exploreBtn}>
            Explore Meals
          </Link>
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.mealImage}>
                <img
                  src={review.mealImage}
                  alt={review.mealTitle}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f0f0f0"/>
                        <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="18">Review Image</text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>

              <div className={styles.reviewContent}>
                <div className={styles.reviewHeader}>
                  <h3>{review.mealTitle}</h3>
                  <div className={styles.reviewMeta}>
                    <span className={styles.mealDate}>
                      Meal: {formatDate(review.mealDate)}
                    </span>
                    <span className={styles.reviewDate}>
                      Reviewed: {formatDate(review.dateCreated)}
                    </span>
                  </div>
                </div>

                {editingReview === review.id ? (
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Rating:</label>
                      {renderStars(editFormData.stars, true, (stars) =>
                        setEditFormData({ ...editFormData, stars })
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label>Title:</label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        className={styles.titleInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Review:</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        className={styles.descriptionTextarea}
                        rows="4"
                      />
                    </div>
                    <div className={styles.editActions}>
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        className={styles.saveBtn}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.reviewDisplay}>
                    <div className={styles.ratingTitle}>
                      {renderStars(review.stars)}
                      <h4>{review.title}</h4>
                    </div>
                    <p className={styles.reviewText}>{review.description}</p>
                    <div className={styles.reviewActions}>
                      <button
                        onClick={() => handleEditClick(review)}
                        className={styles.editBtn}
                      >
                        Edit Review
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
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
          <Link href="/meals" className={styles.quickLink}>
            <span className={styles.linkIcon}>🍽️</span>
            <span>Browse Meals</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
