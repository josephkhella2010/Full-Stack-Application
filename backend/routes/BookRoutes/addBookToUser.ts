import { Router } from "express";

import { Book } from "../../models/BookSchema.js";
import { addUserBookSchema } from "../../zodValidation/BookSchema.js";
import {
  firebaseAuth,
  type AuthRequest,
} from "../../middleware/firebaseAuth.js";

const router = Router();

router.post("/add-user-book", firebaseAuth, async (req, res) => {
  try {
    // Validate bookId and userId
    const validation = addUserBookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid information",
        errors: validation.error.flatten(),
      });
    }

    const { bookId, userId } = validation.data;

    // Get logged-in user's Firebase UID
    const loggedInUserId = (req as AuthRequest).auth?.payload.sub;

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    // Check that userId belongs to logged-in user
    if (userId !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only add books to your own account",
      });
    }

    // Find existing book
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if book is already added to a user
    const assignedUserId = book.getDataValue("userId");

    if (assignedUserId !== null) {
      if (assignedUserId === loggedInUserId) {
        return res.status(409).json({
          success: false,
          message: "You have already added this book to your account",
        });
      }

      return res.status(409).json({
        success: false,
        message: "This book has already been added by another user",
      });
    }

    // Assign book to logged-in user
    await book.update({
      userId: loggedInUserId,
    });

    return res.status(200).json({
      success: true,
      message: "Book added to your account successfully",
      book,
    });
  } catch (error) {
    console.error("Add user book error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add book to user",
    });
  }
});

export default router;
