import { Router } from "express";

import { Book } from "../../models/BookSchema.js";
import { createBookSchema } from "../../zodValidation/BookSchema.js";

import {
  firebaseAuth,
  type AuthRequest,
} from "../../middleware/firebaseAuth.js";

const router = Router();

router.post("/books", firebaseAuth, async (req, res) => {
  try {
    // Validate request body
    const validation = createBookSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid book information",
        errors: validation.error.flatten(),
      });
    }

    // Get logged-in user's Firebase UID
    const loggedInUserId = (req as AuthRequest).auth?.payload.sub;

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const { userId, ...bookData } = validation.data;

    // Check ownership only when a userId is provided
    if (userId && userId !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only add books to your own account",
      });
    }

    // Create book
    const book = await Book.create({
      ...bookData,
      userId: userId ?? null,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
});

export default router;
