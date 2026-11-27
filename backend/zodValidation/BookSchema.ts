import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Book title is required")
    .max(255, "Title cannot exceed 255 characters"),

  author: z
    .string()
    .trim()
    .min(1, "Author is required")
    .max(255, "Author cannot exceed 255 characters"),

  description: z.string().trim().optional(),
});

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Book title is required")
      .max(255)
      .optional(),

    author: z.string().trim().min(1, "Author is required").max(255).optional(),

    description: z.string().trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const bookIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UserIdSchema = z.object({
  uid: z.string().trim().min(1, "User ID cannot be empty"),
});

export const BookIdSchema = z.object({
  id: z.coerce.number().int().positive("Book ID must be a positive number"),
});

export const getBooksQuerySchema = z.object({
  title: z.string().trim().optional(),
  sortBy: z.enum(["date", "title"]).default("date"),
  dateOrder: z.enum(["asc", "desc"]).default("desc"),
  titleOrder: z.enum(["az", "za"]).default("az"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type GetBooksQueryInput = z.infer<typeof getBooksQuerySchema>;
export type GetUserByIdInput = z.infer<typeof UserIdSchema>;
export type GetBookByIdInput = z.infer<typeof BookIdSchema>;
