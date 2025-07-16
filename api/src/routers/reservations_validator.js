import { z } from "zod/v4";
import { SEGMENTS } from "../segments.js";

export const Reservation = z.strictObject({
  number_of_guests: z
    .number()
    .int()
    .positive("Number of guests must be a positive integer"),
  meal_id: z
    .number()
    .int("Meal ID must be an integer")
    .positive("Meal ID must be a positive integer"),
  created_date: z.string().optional(),
  contact_phonenumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 characters long"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.email("Invalid email format").optional(),
  user_id: z.number().int().positive().optional(),
});

export const ReservationUpdate = Reservation.partial();
export const ReservationId = z.object({
  id: z.coerce.number().int().positive(),
});
export const validations = {
  // POST /Reservations
  create: {
    [SEGMENTS.BODY]: Reservation,
  },
  // DELETE /Reservations/:id
  delete: {
    [SEGMENTS.PARAMS]: ReservationId,
  },
  // GET /Reservations/:id
  getById: {
    [SEGMENTS.PARAMS]: ReservationId,
  },
  // PATCH /Reservations/:id
  update: {
    [SEGMENTS.PARAMS]: ReservationId,
    [SEGMENTS.BODY]: ReservationUpdate,
  },
};
