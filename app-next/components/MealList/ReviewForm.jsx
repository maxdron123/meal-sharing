import styles from "./MealCard.module.css";

export default function ReviewForm({ mealId, onSuccess }) {
  return (
    <form
      className={styles.reviewForm}
      style={{ marginTop: 24 }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const rating = Number(form.rating.value);

        try {
          const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meal_id: mealId,
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
      <div>
        <label>
          Title:
          <input type="text" name="title" required />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            name="description"
            rows={4}
            required
            className={styles.textarea}
          />
        </label>
      </div>
      <div>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            defaultValue="5"
            required
          />
        </label>
      </div>
      <button type="submit" className={styles.button}>
        Submit Review
      </button>
    </form>
  );
}
