import { z } from "zod/v4";
import { SEGMENTS } from "../segments.js";

export const Meal = z.strictObject({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  when: z.string().min(1, "Date is required"),
  max_reservations: z
    .number()
    .min(1, "Max reservations must be at least 1")
    .max(20, "Max reservations cannot exceed 20"),
  price: z
    .number()
    .min(1, "Price must be at least 1")
    .max(200, "Price cannot exceed 200"),
  created_date: z.string().optional(),
  image: z.string().nullable().optional(),
  created_by: z.number().optional(),
});

export const MealUpdate = Meal.partial();
export const MealId = z.object({ id: z.coerce.number().int().positive() });
export const validations = {
  // POST /Meals
  create: {
    [SEGMENTS.BODY]: Meal,
  },
  // DELETE /Meals/:id
  delete: {
    [SEGMENTS.PARAMS]: MealId,
  },
  // GET /Meals/:id
  getById: {
    [SEGMENTS.PARAMS]: MealId,
  },
  // PATCH /Meals/:id
  update: {
    [SEGMENTS.PARAMS]: MealId,
    [SEGMENTS.BODY]: MealUpdate,
  },
};
