import express from "express";
import knex from "../database_client.js";
import { validations } from "./reviews_validator.js";
import { validate } from "../validate_middleware.js";

export const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res) => {
  try {
    const reviews = await knex("reviews").select("*").orderBy("id");
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

reviewsRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await knex("reviews")
      .select(
        "reviews.id as id",
        "reviews.title",
        "reviews.description",
        "reviews.meal_id",
        "reviews.stars",
        "reviews.created_date",
        "reviews.user_id",
        "meals.title as meal_title",
        "meals.image as meal_image",
        "meals.location as meal_location"
      )
      .leftJoin("meals", "reviews.meal_id", "meals.id")
      .where("reviews.user_id", userId)
      .orderBy("reviews.id", "desc");
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});

reviewsRouter.post("/", validate(validations.create), async (req, res) => {
  const { title, description, meal_id, stars, created_date, user_id } =
    req.body;

  try {
    const newReview = {
      title,
      description,
      meal_id,
      stars,
      created_date: created_date || new Date().toISOString().split("T")[0],
      user_id,
    };
    if (
      knex.client &&
      knex.client.config &&
      knex.client.config.client === "pg"
    ) {
      const [created] = await knex("reviews")
        .insert(newReview)
        .returning([
          "id",
          "title",
          "description",
          "meal_id",
          "stars",
          "created_date",
          "user_id",
        ]);
      return res.status(201).json({
        message: `Created review for meal ${created.meal_id}`,
        review: created,
      });
    } else {
      const [reviewId] = await knex("reviews").insert(newReview);
      const created = await knex("reviews").where({ id: reviewId }).first();
      return res.status(201).json({
        message: `Created review for meal ${created.meal_id}`,
        review: created,
      });
    }
  } catch (error) {
    console.error("Error creating review:", error);
    // Map common PostgreSQL errors to 4xx with clearer messages
    if (error && error.code) {
      if (error.code === "23503") {
        return res
          .status(400)
          .json({ error: "Invalid meal_id or user_id (FK constraint)" });
      }
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ error: "Duplicate review violates unique constraint" });
      }
      if (error.code === "23502") {
        return res.status(400).json({ error: "Missing required field" });
      }
    }
    res.status(500).json({ error: "Failed to create review" });
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await knex("reviews").where({ id: reviewId }).first();
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

reviewsRouter.delete("/:id", validate(validations.delete), async (req, res) => {
  try {
    const reviewId = req.params.id;

    const existingReview = await knex("reviews")
      .where({ id: reviewId })
      .first();

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    const deletedRows = await knex("reviews").where({ id: reviewId }).del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ success: "Review deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

reviewsRouter.put("/:id", validate(validations.update), async (req, res) => {
  const { title, description, stars } = req.body;

  try {
    const reviewId = req.params.id;
    const updatedReview = {
      title,
      description,
      stars,
    };
    const updatedRows = await knex("reviews")
      .where({ id: reviewId })
      .update(updatedReview);
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    const review = await knex("reviews").where({ id: reviewId }).first();
    res.json(review);
  } catch {
    res.status(500).json({ error: "Failed to update review" });
  }
});
