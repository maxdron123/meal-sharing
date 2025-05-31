import express from "express";
import knex from "../database_client.js";
import { StatusCodes } from "http-status-codes";
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

reservationsRouter.post("/", validate(validations.create), async (req, res) => {
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phonenumber,
    contact_name,
    contact_email,
  } = req.body;

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

reservationsRouter.delete(
  "/:id",
  validate(validations.delete),
  async (req, res) => {
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
  }
);
