import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const meal = await knex("meals").orderBy("id", "desc").first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ error: "Meals not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});
export default router;
