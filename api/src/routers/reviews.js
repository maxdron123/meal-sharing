import express from "express";
import knex from "../database_client.js";

export const reviewsRouter = express.Router();

reviewsRouter.get("/", async (req, res) => {
  try {
    const reviews = await knex("reviews").select("*").orderBy("id");
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

reviewsRouter.post("/", async (req, res) => {
  const { id, title, description, review_id, stars, created_date } = req.body;
  if (
    typeof id !== "number" ||
    !title ||
    !description ||
    typeof review_id !== "number" ||
    typeof stars !== "number" ||
    !created_date
  ) {
    return res.status(400).json({
      error: "Invalid input",
    });
  }
  try {
    const newReview = {
      id,
      title,
      description,
      review_id,
      stars,
      created_date,
    };
    await knex("reviews").insert(newReview);
    res.status(201).end();
  } catch {
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

reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedCount = await knex("reviews").where({ id: reviewId }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

reviewsRouter.delete("/:id", async (req, res) => {
  const reviewId = req.params.id;
  if (reviewId === undefined || isNaN(reviewId) || reviewId <= 0) {
    return res.status(400).json({ error: "Invalid review ID" });
  }
  try {
    const deletedRows = await knex("reviews").where({ id: reviewID }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: "review not found" });
    }
    res.status(202).end();
  } catch {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

reviewsRouter.put("/:id", async (req, res) => {
  const { title, description, review_id, stars, created_date } = req.body;
  if (
    (title !== undefined && typeof title !== "string") ||
    (description !== undefined && typeof description !== "string") ||
    (review_id !== undefined && typeof review_id !== "number") ||
    (stars !== undefined && typeof stars !== "number") ||
    (created_date !== undefined && typeof created_date !== "string")
  ) {
    return res.status(400).json({ error: "Incorrect input" });
  }

  try {
    const reviewId = req.params.id;
    if (reviewId === undefined || isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({ error: "Invalid review ID" });
    }
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
