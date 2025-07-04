"use client";
import styles from "./page.module.css";
import MealCard from "@/components/MealList/MealCard";
import api from "@/utils/api";

async function getMeal(id) {
  const res = await fetch(api(`/meals/${id}`));
  if (!res.ok) return null;
  return res.json();
}

export default async function MealDetailPage({ params }) {
  const meal = await getMeal(params.id);

  if (!meal) {
    return <div>Meal not found.</div>;
  }

  return (
    <div className={styles.background}>
      <MealCard
        id={meal.id}
        title={meal.title}
        description={meal.description}
        image={meal.image}
        location={meal.location}
        price={meal.price}
        single={true}
      />
    </div>
  );
}
