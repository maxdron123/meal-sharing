import styles from "./Forms.module.css";
import api from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ReservationForm({
  mealId,
  onSuccess,
  showNotification,
}) {
  const { user } = useAuth();

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const phone = form.phone.value;
        const email = form.email.value;
        const guests = form.guests.value;

        try {
          const res = await fetch(api("/reservations"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meal_id: mealId,
              user_id: user?.id,
              contact_name: name,
              contact_phonenumber: phone,
              contact_email: email,
              number_of_guests: Number(guests),
              created_date: new Date().toISOString().slice(0, 10),
            }),
          });
          let data = null;
          try {
            data = await res.json();
          } catch (_) {
            // ignore non-JSON body on success
          }
          if (res.ok) {
            if (showNotification) {
              showNotification("Reservation created successfully!", "success");
            } else {
              alert("Reservation created successfully!");
            }
            form.reset();
            if (onSuccess) onSuccess(data?.reservation || null);
          } else {
            let msg =
              (data && (data.error || data.message)) || (await res.text());
            if (showNotification)
              showNotification("Reservation failed: " + msg, "error");
            else alert("Reservation failed: " + msg);
          }
        } catch (err) {
          if (showNotification) {
            showNotification("Reservation failed: " + err.message, "error");
          } else {
            alert("Reservation failed: " + err.message);
          }
        }
      }}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Full Name</span>
          <input
            type="text"
            name="name"
            required
            className={styles.input}
            placeholder="Enter your full name"
            defaultValue={user ? `${user.firstName} ${user.lastName}` : ""}
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Phone Number</span>
          <input
            type="tel"
            name="phone"
            required
            className={styles.input}
            placeholder="Enter your phone number"
            defaultValue={user?.phoneNumber || ""}
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Email Address</span>
          <input
            type="email"
            name="email"
            required
            className={styles.input}
            placeholder="Enter your email"
            defaultValue={user?.email || ""}
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelText}>Number of Guests</span>
          <input
            type="number"
            name="guests"
            min="1"
            defaultValue="1"
            required
            className={styles.input}
          />
        </label>
      </div>

      <button type="submit" className={styles.submitButton}>
        <span className={styles.buttonIcon}>🍽️</span>
        Make Reservation
      </button>
    </form>
  );
}
