import { z } from "zod";

export const registerUserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "firstname cannot be empty")

    .min(2, "First name must contain at least 2 characters")
    .max(255, "First name cannot exceed 255 characters")
    .transform((value) => value.toLowerCase()),

  lastname: z
    .string()
    .trim()
    .min(1, "lastname cannot be empty")

    .min(2, "Last name must contain at least 2 characters")
    .max(255, "Last name cannot exceed 255 characters")
    .transform((value) => value.toLowerCase()),

  username: z
    .string()
    .trim()
    .min(1, "Username cannot be empty")
    .transform((value) => value.toLowerCase()),
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email")
    .transform((value) => value.toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email")
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof loginSchema>;

export const updateUserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "firstname cannot be empty")
    .min(2, "First name must contain at least 2 characters")

    .max(255)
    .transform((value) => value.toLowerCase())
    .optional(),
  lastname: z
    .string()
    .trim()
    .min(1, "lastname cannot be empty")
    .min(2, "lastname must contain at least 2 characters")
    .max(255)
    .transform((value) => value.toLowerCase())
    .optional(),
  username: z
    .string()
    .trim()
    .min(1, "username cannot be empty")
    .min(2, "username must contain at least 2 characters")
    .transform((value) => value.toLowerCase())

    .optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email")
    .transform((value) => value.toLowerCase())
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const idSchema = z.object({
  uid: z.string().trim(),
});

export type GetUserByIdInput = z.infer<typeof idSchema>;
