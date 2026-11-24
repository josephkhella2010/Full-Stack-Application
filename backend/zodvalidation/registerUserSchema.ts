import { z } from "zod";

export const registerUserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters")
    .max(255, "First name cannot exceed 255 characters"),

  lastname: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters")
    .max(255, "Last name cannot exceed 255 characters"),

  username: z
    .string()
    .trim()
    .min(1, "Username cannot be empty")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .transform((value) => value.toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
