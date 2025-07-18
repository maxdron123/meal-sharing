import express from "express";
import knex from "../database_client.js";
import { StatusCodes } from "http-status-codes";
import { validations } from "./meals_validator.js";
import { validate } from "../validate_middleware.js";

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
    let query = knex("meals")
      .select(
        "meals.*",
        knex.raw("COALESCE(r.total_reservations, 0) as current_reservations"),
        knex.raw(
          "(meals.max_reservations - COALESCE(r.total_reservations, 0)) as available_spots"
        ),
        knex.raw("COALESCE(rv.average_rating, 0) as average_rating"),
        knex.raw("COALESCE(rv.review_count, 0) as review_count")
      )
      .leftJoin(
        knex("reservations")
          .select("meal_id")
          .count("* as total_reservations")
          .groupBy("meal_id")
          .as("r"),
        "meals.id",
        "r.meal_id"
      )
      .leftJoin(
        knex("reviews")
          .select("meal_id")
          .avg("stars as average_rating")
          .count("* as review_count")
          .groupBy("meal_id")
          .as("rv"),
        "meals.id",
        "rv.meal_id"
      );
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

      if (availableReservations === "true") {
        query = query.whereRaw(
          "meals.max_reservations > COALESCE(r.total_reservations, 0)"
        );
      } else {
        query = query.whereRaw(
          "meals.max_reservations <= COALESCE(r.total_reservations, 0)"
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
      const allowedSortKeys = [
        "when",
        "max_reservations",
        "price",
        "average_rating",
      ];
      const allowedSortDirs = ["asc", "desc"];
      if (!allowedSortKeys.includes(sortKey)) {
        return res.status(400).json({ error: "Invalid sortKey" });
      }
      const direction = sortDir ? sortDir : "asc";
      if (!allowedSortDirs.includes(direction)) {
        return res.status(400).json({ error: "Invalid sortDir" });
      }

      if (sortKey === "average_rating") {
        query = query.orderByRaw(`COALESCE(rv.average_rating, 0) ${direction}`);
      } else {
        query = query.orderBy(sortKey, direction);
      }
    } else {
      query = query.orderBy("id");
    }
    const meals = await query;
    
    // Convert base64 images to data URLs
    const mealsWithImages = meals.map(meal => {
      if (meal.image && !meal.image.startsWith('data:')) {
        meal.image = `data:image/jpeg;base64,${meal.image}`;
      }
      return meal;
    });
    
    res.json(mealsWithImages);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch meals", details: error.message });
  }
});

mealsRouter.post("/", validate(validations.create), async (req, res) => {
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
    image,
    created_by,
  } = req.body;

  try {
    const mysqlDatetime = new Date(when)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const newMeal = {
      title,
      description,
      location,
      when: mysqlDatetime,
      max_reservations,
      price,
      created_date: created_date || new Date().toISOString().split("T")[0],
      image,
      created_by,
    };
    const [mealId] = await knex("meals").insert(newMeal);
    const createdMeal = await knex("meals").where({ id: mealId }).first();
    res.status(201).json({
      message: `Created meal ${createdMeal.title}!`,
      meal: createdMeal,
    });
  } catch {
    res.status(500).json({ error: "Failed to create meal" });
  }
});

mealsRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const meals = await knex("meals")
      .select(
        "meals.*",
        knex.raw("COALESCE(r.total_reservations, 0) as current_reservations"),
        knex.raw(
          "(meals.max_reservations - COALESCE(r.total_reservations, 0)) as available_spots"
        ),
        knex.raw("COALESCE(rv.average_rating, 0) as average_rating"),
        knex.raw("COALESCE(rv.review_count, 0) as review_count")
      )
      .leftJoin(
        knex("reservations")
          .select("meal_id")
          .count("* as total_reservations")
          .groupBy("meal_id")
          .as("r"),
        "meals.id",
        "r.meal_id"
      )
      .leftJoin(
        knex("reviews")
          .select("meal_id")
          .avg("stars as average_rating")
          .count("* as review_count")
          .groupBy("meal_id")
          .as("rv"),
        "meals.id",
        "rv.meal_id"
      )
      .where("meals.created_by", userId)
      .orderBy("meals.id", "desc");

    // Convert base64 images to data URLs
    const mealsWithImages = meals.map(meal => {
      if (meal.image && !meal.image.startsWith('data:')) {
        meal.image = `data:image/jpeg;base64,${meal.image}`;
      }
      return meal;
    });

    res.json(mealsWithImages);
  } catch (error) {
    console.error("Error fetching user meals:", error);
    res.status(500).json({ error: "Failed to fetch user meals" });
  }
});

mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex("meals")
      .select(
        "meals.*",
        knex.raw("COALESCE(r.total_reservations, 0) as current_reservations"),
        knex.raw(
          "(meals.max_reservations - COALESCE(r.total_reservations, 0)) as available_spots"
        ),
        knex.raw("COALESCE(rv.average_rating, 0) as average_rating"),
        knex.raw("COALESCE(rv.review_count, 0) as review_count")
      )
      .leftJoin(
        knex("reservations")
          .select("meal_id")
          .count("* as total_reservations")
          .groupBy("meal_id")
          .as("r"),
        "meals.id",
        "r.meal_id"
      )
      .leftJoin(
        knex("reviews")
          .select("meal_id")
          .avg("stars as average_rating")
          .count("* as review_count")
          .groupBy("meal_id")
          .as("rv"),
        "meals.id",
        "rv.meal_id"
      )
      .where("meals.id", mealId)
      .first();

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    
    // Convert base64 image to data URL
    if (meal.image && !meal.image.startsWith('data:')) {
      meal.image = `data:image/jpeg;base64,${meal.image}`;
    }
    
    res.json(meal);
  } catch {
    res.status(500).json({ error: "Failed to fetch meal" });
  }
});

mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  const mealId = req.params.meal_id;
  try {
    const reviews = await knex("reviews").where({ meal_id: mealId });
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews for this meal" });
  }
});

mealsRouter.put("/:id", validate(validations.update), async (req, res) => {
  const mealId = req.params.id;
  const {
    title,
    description,
    location,
    when,
    max_reservations,
    price,
    created_date,
    image,
  } = req.body;

  try {
    const updatedMeal = {};

    if (title !== undefined) updatedMeal.title = title;
    if (description !== undefined) updatedMeal.description = description;
    if (location !== undefined) updatedMeal.location = location;
    if (when !== undefined) {
      updatedMeal.when = new Date(when)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    if (max_reservations !== undefined)
      updatedMeal.max_reservations = max_reservations;
    if (price !== undefined) updatedMeal.price = price;
    if (created_date !== undefined) updatedMeal.created_date = created_date;
    if (image !== undefined) updatedMeal.image = image; // Support Base64 image updates
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

mealsRouter.delete("/:id", validate(validations.delete), async (req, res) => {
  const mealId = req.params.id;
  try {
    const deletedRows = await knex("meals").where({ id: mealId }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(StatusCodes.NO_CONTENT).end();
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
