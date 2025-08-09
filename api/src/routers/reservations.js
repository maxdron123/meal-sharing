import express from "express";
import knex from "../database_client.js";
import { validations } from "./reservations_validator.js";
import { validate } from "../validate_middleware.js";

export const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations").select("*").orderBy("id");
    res.json(reservations);
  } catch {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

reservationsRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const reservations = await knex("reservations")
      .select(
        "reservations.id as id",
        "reservations.number_of_guests",
        "reservations.meal_id",
        "reservations.created_date",
        "reservations.contact_phonenumber",
        "reservations.contact_name",
        "reservations.contact_email",
        "reservations.user_id",
        "meals.title as meal_title",
        "meals.description as meal_description",
        "meals.location as meal_location",
        "meals.when as meal_when",
        "meals.max_reservations as meal_max_reservations",
        "meals.price as meal_price",
        "meals.created_by as meal_created_by",
        "meals.image as meal_image"
      )
      .leftJoin("meals", "reservations.meal_id", "meals.id")
      .where("reservations.user_id", userId)
      .orderBy("reservations.id", "desc");

    res.json(reservations);
  } catch {
    res.status(500).json({ error: "Failed to fetch user reservations" });
  }
});

reservationsRouter.post("/", validate(validations.create), async (req, res) => {
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
    user_id,
  } = req.body;

  try {
    const newReservation = {
      number_of_guests,
      meal_id,
      created_date: created_date || new Date().toISOString().split("T")[0],
      contact_phonenumber,
      contact_name,
      contact_email,
      user_id,
    };
    // Handle PostgreSQL vs others consistently
    if (
      knex.client &&
      knex.client.config &&
      knex.client.config.client === "pg"
    ) {
      const [created] = await knex("reservations")
        .insert(newReservation)
        .returning([
          "id",
          "number_of_guests",
          "meal_id",
          "created_date",
          "contact_phonenumber",
          "contact_name",
          "contact_email",
          "user_id",
        ]);
      return res.status(201).json({
        message: `Created reservation for ${created.contact_name}!`,
        reservation: created,
      });
    } else {
      const [reservationId] = await knex("reservations").insert(newReservation);
      const created = await knex("reservations")
        .where({ id: reservationId })
        .first();
      return res.status(201).json({
        message: `Created reservation for ${created.contact_name}!`,
        reservation: created,
      });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservationID = req.params.id;
    const reservation = await knex("reservations")
      .where({ id: reservationID })
      .first();
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch {
    res.status(500).json({ error: "Failed to fetch reservation" });
  }
});

reservationsRouter.put(
  "/:id",
  validate(validations.update),
  async (req, res) => {
    const {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;

    const reservationID = req.params.id;

    try {
      const updatedReservation = {
        number_of_guests,
        meal_id,
        created_date,
        contact_phonenumber,
        contact_name,
        contact_email,
      };
      const updatedRows = await knex("reservations")
        .where({ id: reservationID })
        .update(updatedReservation);
      if (updatedRows === 0) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      const reservation = await knex("reservations")
        .where({ id: reservationID })
        .first();
      res.json(reservation);
    } catch {
      res.status(500).json({ error: "Failed to update reservation" });
    }
  }
);

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const reservationID = req.params.id;

    if (isNaN(reservationID) || !Number.isInteger(Number(reservationID))) {
      return res.status(400).json({ error: "Invalid reservation ID format" });
    }

    const existingReservation = await knex("reservations")
      .where({ id: reservationID })
      .first();

    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const deletedRows = await knex("reservations")
      .where({ id: reservationID })
      .del();

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ success: "Reservation deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});
