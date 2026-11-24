
import { z } from "zod";

export const registerUserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "First name cannot be empty")
    .min(2, "First name must contain at least 2 characters")
    .max(255, "First name cannot exceed 255 characters"),

  lastname: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty")
    .min(2, "Last name must contain at least 2 characters")
    .max(255, "Last name cannot exceed 255 characters"),

  username: z
    .string()
    .trim()
    .min(1, "Username cannot be empty")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(6, "Password must contain at least 6 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
