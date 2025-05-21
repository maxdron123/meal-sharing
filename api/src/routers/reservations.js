import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations").select("*").orderBy("id");
    res.json(reservations);
  } catch {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;
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

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  try {
    const reservationID = req.params.id;
    const {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;
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

router.delete("/:id", async (req, res) => {
  try {
    const reservationID = req.params.id;
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

export default router;
