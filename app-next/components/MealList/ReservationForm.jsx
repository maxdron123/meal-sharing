import styles from "./MealCard.module.css";

export default function ReservationForm({ mealId, onSuccess }) {
  return (
    <form
      className={styles.reservationForm}
      style={{ marginTop: 24 }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const phone = form.phone.value;
        const email = form.email.value;
        const guests = form.guests.value;

        try {
          const res = await fetch("/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meal_id: mealId,
              contact_name: name,
              contact_phonenumber: phone,
              contact_email: email,
              number_of_guests: Number(guests),
              created_date: new Date().toISOString().slice(0, 10),
            }),
          });
          if (res.ok) {
            alert("Reservation created successfully!");
            form.reset();
            if (onSuccess) onSuccess();
          } else {
            const error = await res.text();
            alert("Reservation failed: " + error);
          }
        } catch (err) {
          alert("Reservation failed: " + err.message);
        }
      }}
    >
      <div>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input type="tel" name="phone" required />
        </label>
      </div>
      <div>
        <label>
          Number of Guests:
          <input
            type="number"
            name="guests"
            min="1"
            defaultValue="1"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
      </div>
      <button type="submit" className={styles.button}>
        Submit Reservation
      </button>
    </form>
  );
}
