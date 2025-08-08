import express from "express";
import knex from "../database_client.js";
import {
  validateNewUser,
  validateUserUpdate,
  validateUserId,
} from "./users_validator.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await knex("users")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "profile_image",
        "email_verified",
        "is_active",
        "created_at",
        "last_login"
      )
      .where("is_active", true)
      .orderBy("created_at", "desc");

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/:id - Get user by ID
usersRouter.get("/:id", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await knex("users")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "profile_image",
        "email_verified",
        "is_active",
        "created_at",
        "last_login"
      )
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_active) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/email/:email - Get user by email (for authentication)
usersRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await knex("users").select("*").where({ email }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /users - Create new user
usersRouter.post("/", validateNewUser, async (req, res) => {
  try {
    const {
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      profile_image,
      email_verified,
      is_active,
    } = req.body;

    // Check if user already exists
    const existingUser = await knex("users").where({ email }).first();

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const insertPayload = {
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      profile_image,
      email_verified: email_verified || false,
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (knex.client.config.client === "pg") {
      const [created] = await knex("users")
        .insert(insertPayload)
        .returning([
          "id",
          "email",
          "first_name",
          "last_name",
          "phone_number",
          "profile_image",
          "email_verified",
          "is_active",
          "created_at",
          "updated_at",
        ]);
      return res.status(201).json(created);
    } else {
      const [newUserId] = await knex("users").insert(insertPayload);
      const newUser = await knex("users")
        .select(
          "id",
          "email",
          "first_name",
          "last_name",
          "phone_number",
          "profile_image",
          "email_verified",
          "is_active",
          "created_at"
        )
        .where({ id: newUserId })
        .first();
      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /users/:id - Update user
usersRouter.put(
  "/:id",
  validateUserId,
  validateUserUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      updateData.updated_at = new Date();

      // Remove password_hash from update data if present (should use separate endpoint)
      delete updateData.password_hash;
      delete updateData.id;
      delete updateData.created_at;

      const updated = await knex("users").where({ id }).update(updateData);

      if (updated === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get updated user
      const user = await knex("users")
        .select(
          "id",
          "email",
          "first_name",
          "last_name",
          "phone_number",
          "profile_image",
          "email_verified",
          "is_active",
          "created_at",
          "updated_at"
        )
        .where({ id })
        .first();

      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// PUT /users/:id/login - Update last login timestamp
usersRouter.put("/:id/login", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await knex("users").where({ id }).update({
      last_login: new Date(),
      updated_at: new Date(),
    });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Login timestamp updated" });
  } catch (error) {
    console.error("Error updating login timestamp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /users/:id - Soft delete user (deactivate)
usersRouter.delete("/:id", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await knex("users").where({ id }).update({
      is_active: false,
      updated_at: new Date(),
    });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/:id/reservations - Get user's reservations
usersRouter.get("/:id/reservations", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const reservations = await knex("reservations")
      .select(
        "reservations.*",
        "meals.title as meal_title",
        "meals.image as meal_image",
        "meals.location as meal_location",
        "meals.when as meal_when"
      )
      .join("meals", "reservations.meal_id", "meals.id")
      .where("reservations.user_id", id)
      .orderBy("reservations.created_date", "desc");

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/:id/reviews - Get user's reviews
usersRouter.get("/:id/reviews", validateUserId, async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await knex("reviews")
      .select(
        "reviews.*",
        "meals.title as meal_title",
        "meals.image as meal_image"
      )
      .join("meals", "reviews.meal_id", "meals.id")
      .where("reviews.user_id", id)
      .orderBy("reviews.created_date", "desc");

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
