import { z } from "zod/v4";
import { SEGMENTS } from "../segments.js";

export const Review = z.strictObject({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  meal_id: z
    .number()
    .int("Meal ID must be an integer")
    .positive("Meal ID must be a positive integer"),
  stars: z
    .number()
    .min(1, "Stars must be at least 1")
    .max(5, "Stars cannot exceed 5"),
  created_date: z.string().optional(),
  user_id: z.number().int().positive().optional(),
});

export const ReviewUpdate = Review.partial();
export const ReviewId = z.object({ id: z.coerce.number().int().positive() });
export const validations = {
  create: {
    [SEGMENTS.BODY]: Review,
  },
  delete: {
    [SEGMENTS.PARAMS]: ReviewId,
  },
  getById: {
    [SEGMENTS.PARAMS]: ReviewId,
  },
  update: {
    [SEGMENTS.PARAMS]: ReviewId,
    [SEGMENTS.BODY]: ReviewUpdate,
  },
};
