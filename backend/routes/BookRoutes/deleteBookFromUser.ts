import { Router } from "express";

import {
  firebaseAuth,
  type AuthRequest,
} from "../../middleware/firebaseAuth.js";

import { Book } from "../../models/BookSchema.js";
import { RemoveBookSchema } from "../../zodValidation/BookSchema.js";

const router = Router();

// DELETE book from logged-in user's library
router.delete("/my-library/:bookId", firebaseAuth, async (req, res) => {
  try {
    // Validate book ID
    const validation = RemoveBookSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        errors: validation.error.flatten(),
      });
    }

    const { bookId } = validation.data;

    // Get authenticated Firebase user
    const userId = (req as AuthRequest).auth?.payload.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find book
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check that the book belongs to the logged-in user
    if (book.getDataValue("userId") !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only remove books from your own library",
      });
    }

    // Remove ownership but keep the book in the database
    await book.update({
      userId: null,
    });

    return res.status(200).json({
      success: true,
      message: "Book removed from your library successfully",
      book,
    });
  } catch (error) {
    console.error("Remove book from library error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove book from your library",
    });
  }
});

export default router;
