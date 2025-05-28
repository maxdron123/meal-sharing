import express from "express";
import knex from "../database_client.js";

export const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  const {
    maxPrice,
    availableReservations,
    title,
    dateAfter,
    dateBefore,
    limit,
    sortKey,
    sortDir,
  } = req.query;
  try {
    let query = knex("meals").select("*").orderBy("id");
    if (maxPrice !== undefined) {
      if (isNaN(Number(maxPrice))) {
        return res.status(400).json({ error: "maxPrice must be a number" });
      }
      query = query.where("price", "<", Number(maxPrice));
    }

    if (availableReservations !== undefined) {
      if (
        availableReservations !== "true" &&
        availableReservations !== "false"
      ) {
        return res.status(400).json({
          error: "availableReservations must be 'true' or 'false'",
        });
      }

      query = query.leftJoin(
        knex("reservations")
          .select("meal_id")
          .count("* as total_reservations")
          .groupBy("meal_id")
          .as("r"),
        "meals.id",
        "r.meal_id"
      );

      if (availableReservations === "true") {
        query = query.whereRaw(
          "meals.max_reservations > IFNULL(r.total_reservations, 0)"
        );
      } else {
        query = query.whereRaw(
          "meals.max_reservations <= IFNULL(r.total_reservations, 0)"
        );
      }
    }

    if (title !== undefined) {
      if (typeof title !== "string") {
        return res.status(400).json({ error: "title must be a string" });
      }
      query = query.where("title", "like", `%${title}%`);
    }

    if (dateAfter !== undefined) {
      if (isNaN(Date.parse(dateAfter))) {
        return res.status(400).json({ error: "dateAfter must be a date" });
      }
      query = query.where("when", ">", new Date(dateAfter));
    }

    if (dateBefore !== undefined) {
      if (isNaN(Date.parse(dateBefore))) {
        return res.status(400).json({ error: "dateBefore must be a date" });
      }
      query = query.where("when", "<", new Date(dateBefore));
    }

    if (limit !== undefined) {
      if (isNaN(Number(limit))) {
        return res.status(400).json({ error: "limit must be a number" });
      }
      query = query.limit(Number(limit));
    }

    if (sortKey !== undefined) {
      if (typeof sortKey !== "string") {
        return res.status(400).json({ error: "sortKey must be a string" });
      }
      const allowedSortKeys = ["when", "max_reservations", "price"];
      const allowedSortDirs = ["asc", "desc"];
      if (!allowedSortKeys.includes(sortKey)) {
        return res.status(400).json({ error: "Invalid sortKey" });
      }
      const direction = sortDir ? sortDir : "asc";
      if (!allowedSortDirs.includes(direction)) {
        return res.status(400).json({ error: "Invalid sortDir" });
      }
      query = query.orderBy(sortKey, direction);
    }
    const meals = await query;
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

mealsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
  } = req.body;
  if (
    !title ||
    !description ||
    !location ||
    !when ||
    typeof max_reservations !== "number" ||
    typeof price !== "number" ||
    !created_date
  ) {
    return res.status(400).json({
      error: "Invalid input",
    });
  }

  try {
    const newMeal = {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    };
    const [mealId] = await knex("meals").insert(newMeal);
    const createdMeal = await knex("meals").where({ id: mealId }).first();
    res.status(201).send(`Created meal ${createdMeal.title}!`);
  } catch {
    res.status(500).json({ error: "Failed to create meal" });
  }
});

mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex("meals").where({ id: mealId }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  } catch {
    res.status(500).json({ error: "Failed to fetch meal" });
  }
});

mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id;
  if (!mealId || isNaN(mealId)) {
    return res.status(400).json({ error: "Invalid meal_id" });
  }
  try {
    const reviews = await knex("reviews").where({ meal_id: mealId });
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews for this meal" });
  }
});

mealsRouter.put("/:id", async (req, res) => {
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
  } = req.body;
  if (
    (title !== undefined && typeof title !== "string") ||
    (description !== undefined && typeof description !== "string") ||
    (location !== undefined && typeof location !== "string") ||
    (when !== undefined && typeof when !== "string") ||
    (max_reservations !== undefined && typeof max_reservations !== "number") ||
    (price !== undefined && typeof price !== "number") ||
    (created_date !== undefined && typeof created_date !== "string")
  ) {
    return res.status(400).json({ error: "Incorrect input" });
  }

  try {
    const mealId = req.params.id;
    if (mealId === undefined || isNaN(mealId) || mealId <= 0) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }
    const updatedMeal = {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    };
    const updatedRows = await knex("meals")
      .where({ id: mealId })
      .update(updatedMeal);
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }
    const meal = await knex("meals").where({ id: mealId }).first();
    res.json(meal);
  } catch {
    res.status(500).json({ error: "Failed to update meal" });
  }
});

mealsRouter.delete("/:id", async (req, res) => {
  const mealId = req.params.id;
  if (mealId === undefined || isNaN(mealId) || mealId <= 0) {
    return res.status(400).json({ error: "Invalid meal ID" });
  }
  try {
    const deletedRows = await knex("meals").where({ id: mealID }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).send({ success: "Meal deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const meal = await knex("meals").orderBy("id", "asc").first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "Meals not found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

mealsRouter.get("/last-meal", async (req, res) => {
  try {
    const meal = await knex("meals").orderBy("id", "desc").first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "Meals not found" });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

mealsRouter.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex("meals")
      .where("when", ">", knex.fn.now())
      .orderBy("id");
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch past meals" });
  }
});

mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex("meals")
      .where("when", "<", knex.fn.now())
      .orderBy("id");
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch past meals" });
  }
});
