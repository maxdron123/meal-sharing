import styles from "./ReviewCard.module.css";
import Rating from "./Rating";

export default function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewRating}>
          <Rating rating={review.stars} reviewCount={0} showCount={false} />
        </div>
        <div className={styles.reviewDate}>
          {review.created_date && formatDate(review.created_date)}
        </div>
      </div>

      <div className={styles.reviewContent}>
        <h4 className={styles.reviewTitle}>{review.title}</h4>
        <p className={styles.reviewDescription}>{review.description}</p>
      </div>

      <div className={styles.reviewFooter}>
        <div className={styles.reviewAuthor}>
          <span className={styles.authorIcon}>👤</span>
          <span className={styles.authorName}>Anonymous Reviewer</span>
        </div>
      </div>
    </div>
  );
}
