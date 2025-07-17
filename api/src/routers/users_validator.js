import { z } from "zod/v4";
import { validate } from "../validate_middleware.js";

// Schema for creating a new user
export const NewUser = z.strictObject({
  email: z.string().email("Invalid email format").max(255),
  password_hash: z.string().min(8, "Password hash too short").max(255),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  phone_number: z.string().max(20).nullable().optional(),
  profile_image: z.string().max(500).nullable().optional(),
  email_verified: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// Schema for updating a user
export const UserUpdate = z
  .strictObject({
    email: z.string().email("Invalid email format").max(255).optional(),
    first_name: z.string().min(1, "First name is required").max(100).optional(),
    last_name: z.string().min(1, "Last name is required").max(100).optional(),
    phone_number: z.string().max(20).nullable().optional(),
    profile_image: z.string().max(500).nullable().optional(),
    email_verified: z.boolean().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Validation middlewares
export const validateNewUser = validate({
  body: NewUser,
});

export const validateUserUpdate = validate({
  body: UserUpdate,
});

// Validation for user ID parameter
export const validateUserId = (req, res, next) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Invalid user ID. Must be a positive integer.",
    });
  }

  req.params.id = userId;
  next();
};
