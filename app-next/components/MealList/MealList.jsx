"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Meal from "./Meal.jsx";

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
    <Box sx={{ width: "100%", padding: 2 }}>
      <h2>Meals</h2>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {meals.map((meal) => (
            <Grid size={6} key={meal.id}>
              <Meal meal={meal} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
