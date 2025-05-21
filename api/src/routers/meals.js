import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const meals = await knex("meals").select("*").orderBy("id");
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, location, when, max_reservations, price } =
      req.body;
    const newMeal = {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
    };
    const [mealId] = await knex("meals").insert(newMeal);
    const createdMeal = await knex("meals").where({ id: mealId }).first();
    res.status(201).send(`Created meal ${createdMeal.title}!`);
  } catch {
    res.status(500).json({ error: "Failed to create meal" });
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const { title, description, location, when, max_reservations, price } =
      req.body;
    const updatedMeal = {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
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

router.delete("/:id", async (req, res) => {
  const mealID = req.params.id;
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

router.get("/first-meal", async (req, res) => {
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

router.get("/last-meal", async (req, res) => {
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

router.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex("meals")
      .where("when", ">", knex.fn.now())
      .orderBy("id");
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch past meals" });
  }
});

router.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex("meals")
      .where("when", "<", knex.fn.now())
      .orderBy("id");
    res.json(meals);
  } catch {
    res.status(500).json({ error: "Failed to fetch past meals" });
  }
});

export default router;
