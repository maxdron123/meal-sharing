import express from "express";
import knex from "../database_client.js";
import { StatusCodes } from "http-status-codes";
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

reviewsRouter.post("/", validate(validations.create), async (req, res) => {
  const { id, title, description, meal_id, stars, created_date, user_id } =
    req.body;

  try {
    const newReview = {
      id,
      title,
      description,
      meal_id,
      stars,
      created_date: created_date || new Date().toISOString().split("T")[0],
      user_id,
    };
    await knex("reviews").insert(newReview);
    res.status(201).end();
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

reviewsRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await knex("reviews")
      .select(
        "reviews.*",
        "meals.title as meal_title",
        "meals.image as meal_image"
      )
      .leftJoin("meals", "reviews.meal_id", "meals.id")
      .where("reviews.user_id", userId)
      .orderBy("reviews.id", "desc");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
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
    const deletedCount = await knex("reviews").where({ id: reviewId }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(StatusCodes.NO_CONTENT).end();
  } catch {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

reviewsRouter.put("/:id", validate(validations.update), async (req, res) => {
  const { title, description, review_id, stars, created_date } = req.body;

  try {
    const reviewId = req.params.id;
    const updatedReview = {
      title,
      description,
      review_id,
      stars,
      created_date,
    };
    const updatedRows = await knex("reviews")
      .where({ id: reviewId })
      .update(updatedReview);
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).end();
  } catch {
    res.status(500).json({ error: "Failed to update review" });
  }
});
