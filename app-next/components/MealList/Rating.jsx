import styles from "./Rating.module.css";

export default function Rating({ rating, reviewCount, showCount = true }) {
  // Convert rating to number and handle edge cases
  const numericRating = Number(rating) || 0;
  const numericReviewCount = Number(reviewCount) || 0;

  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.stars}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={`${styles.star} ${styles.filled}`}>
            ⭐
          </span>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <span className={`${styles.star} ${styles.half}`}>⭐</span>
        )}

        {/* Empty stars - always show all 5 stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={`${styles.star} ${styles.empty}`}>
            ☆
          </span>
        ))}
      </div>

      {showCount && (
        <div className={styles.ratingInfo}>
          <span className={styles.ratingValue}>
            {numericRating > 0 ? numericRating.toFixed(1) : "No rating"}
          </span>
          {numericReviewCount > 0 && (
            <span className={styles.reviewCount}>
              ({numericReviewCount} review{numericReviewCount !== 1 ? "s" : ""})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
