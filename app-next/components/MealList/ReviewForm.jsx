import styles from "./Forms.module.css";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ReviewForm({ mealId, onSuccess }) {
  const { user } = useAuth();

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const rating = Number(form.rating.value);

        try {
          const res = await fetch(api("/reviews"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meal_id: mealId,
              user_id: user?.id,
              title,
              description,
              stars: rating,
              created_date: new Date().toISOString().slice(0, 10),
            }),
          });
          if (res.ok) {
            alert("Review submitted successfully!");
            form.reset();
            if (onSuccess) onSuccess();
          } else {
            const error = await res.text();
            alert("Review failed: " + error);
          }
        } catch (err) {
          alert("Review failed: " + err.message);
        }
      }}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Review Title</span>
          <input
            type="text"
            name="title"
            required
            className={styles.input}
            placeholder="Give your review a title"
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Your Review</span>
          <textarea
            name="description"
            rows={5}
            required
            className={styles.textarea}
            placeholder="Share your experience with this meal..."
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Rating</span>
          <div className={styles.ratingContainer}>
            <select
              name="rating"
              defaultValue="5"
              required
              className={styles.ratingSelect}
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>
        </label>
      </div>

      <button type="submit" className={styles.submitButton}>
        <span className={styles.buttonIcon}>⭐</span>
        Submit Review
      </button>
    </form>
  );
}
