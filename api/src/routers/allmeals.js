import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const meals = await knex("meals").select("*").orderBy("id");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

export default router;
