import express from "express";
import knex from "../database_client.js";

export const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations").select("*").orderBy("id");
    res.json(reservations);
  } catch {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

reservationsRouter.post("/", async (req, res) => {
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
  } = req.body;

  if (
    typeof number_of_guests !== "number" ||
    typeof meal_id !== "number" ||
    !created_date ||
    typeof contact_phonenumber !== "number" ||
    !contact_name ||
    !contact_email !== "number"
  ) {
    return res.status(400).json({
      error: "Invalid input",
    });
  }

  try {
    const newReservation = {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    };
    const [reservationID] = await knex("reservations")
      .insert(newReservation)
      .returning("id");
    const createdReservation = await knex("reservations")
      .where({ id: reservationID })
      .first();
    res
      .status(201)
      .send(`Created reservation for ${createdReservation.contact_name}!`);
  } catch {
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

reservationsRouter.put("/:id", async (req, res) => {
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
  } = req.body;

  if (
    (number_of_guests !== undefined && typeof number_of_guests !== "number") ||
    (meal_id !== undefined && typeof meal_id !== "number") ||
    (created_date !== undefined && typeof created_date !== "string") ||
    (contact_phonenumber !== undefined &&
      typeof contact_phonenumber !== "string") ||
    (contact_name !== undefined && typeof contact_name !== "string") ||
    (contact_email !== undefined && typeof contact_email !== "string")
  ) {
    return res.status(400).json({ error: "Incorrect input" });
  }
  try {
    const reservationID = req.params.id;
    if (
      reservationID === undefined ||
      isNaN(reservationID) ||
      reservationID <= 0
    ) {
      return res.status(400).json({ error: "Invalid reservation ID" });
    }
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
});

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const reservationID = req.params.id;
    if (
      reservationID === undefined ||
      isNaN(reservationID) ||
      reservationID <= 0
    ) {
      return res.status(400).json({ error: "Invalid reservation ID" });
    }
    const deletedRows = await knex("reservations")
      .where({ id: reservationID })
      .del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).send({ success: "Reservation deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});
