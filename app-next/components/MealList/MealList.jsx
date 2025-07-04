"use client";
import React, { useEffect, useState } from "react";
import styles from "./MealList.module.css";
import MealCard from "./MealCard";
import api from "@/utils/api";

function getRandomMeals(meals, count) {
  const shuffled = [...meals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MealsList({ full = true }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(api("/meals"))
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading meals...</p>;
  if (!full) {
    const randomMeals = getRandomMeals(meals, 5);
    return (
      <div className={styles.containerAlt}>
        <h2 className={styles.heading}>Meals</h2>
        {randomMeals.length === 0 ? (
          <p>No meals found.</p>
        ) : (
          <div className={styles.gridAlt}>
            {randomMeals.map((meal) => (
              <MealCard
                id={meal.id}
                title={meal.title}
                description={meal.description}
                location={meal.location}
                price={meal.price}
                image={meal.image}
                key={meal.id}
                single={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else if (full) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Meals</h2>
        {meals.length === 0 ? (
          <p>No meals found.</p>
        ) : (
          <div className={styles.grid}>
            {meals.map((meal) => (
              <MealCard
                id={meal.id}
                title={meal.title}
                description={meal.description}
                location={meal.location}
                price={meal.price}
                image={meal.image}
                key={meal.id}
                single={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
