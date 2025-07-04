import MealsList from "@/components/MealList/MealList";
import styles from "./page.module.css";
export default function MealsPage() {
  return (
    <div className={styles.background}>
      <MealsList full={true} />;
    </div>
  );
}
