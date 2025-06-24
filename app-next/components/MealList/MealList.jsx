"use client";
import React, { useEffect, useState } from "react";

export default function MealsList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/meals")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched meals:", data);
        setMeals(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading meals...</p>;

  return (
    <div>
      <h2>Meals</h2>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        meals.map((meal) => (
          <div key={meal.id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>{meal.title}</strong>
            </p>
            <p>{meal.description}</p>
            <p>Price: {meal.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
