/* import { z } from "zod";

export const userZodSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  firstname: z.string().min(1, "Please fill in firstname").max(255),
  lastname: z.string().min(1, "Please fill in lastname").max(255),

  username: z
    .string()
    .min(1, "Please fill in username")
    .min(4, "username must be at least 4 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  email: z
    .email("Please enter a valid email address")
    .min(1, "Please fill in email"),
  password: z
    .string()
    .min(4)
    .max(255)
    .min(1, "Please fill in password")
    .min(4, "Password must be at least 4 characters"),
});

export type UserInput = z.infer<typeof userZodSchema>;
 */
import { z } from "zod";

export const userZodSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),

  firstname: z
    .string()
    .min(1, "Please fill in firstname")
    .max(255, "Firstname cannot exceed 255 characters"),

  lastname: z
    .string()
    .min(1, "Please fill in lastname")
    .max(255, "Lastname cannot exceed 255 characters"),

  username: z
    .string()
    .min(1, "Please fill in username")
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username cannot exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  email: z
    .string()
    .min(1, "Please fill in email")
    .email("Please enter a valid email address")
    .max(255, "Email cannot exceed 255 characters"),

  password: z
    .string()
    .min(1, "Please fill in password")
    .min(4, "Password must be at least 4 characters")
    .max(255, "Password cannot exceed 255 characters"),
});

export type UserInput = z.infer<typeof userZodSchema>;
