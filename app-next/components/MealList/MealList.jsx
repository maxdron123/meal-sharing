"use client";
import React, { useEffect, useState } from "react";
import styles from "./MealList.module.css";
import Meal from "./Meal";

export default function MealsList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/meals")
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading meals...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Meals</h2>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        <div className={styles.grid}>
          {meals.map((meal) => (
            <Meal
              title={meal.title}
              description={meal.description}
              image={meal.image}
              key={meal.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
