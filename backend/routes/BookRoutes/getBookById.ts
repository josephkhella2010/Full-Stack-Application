import { BookIdSchema } from "../../zodValidation/BookSchema.js";
import { firebaseAuth } from "../../middleware/firebaseAuth.js";
import { Book } from "../../models/BookSchema.js";
import { Router } from "express";
const router = Router();

router.get("/books/:id", firebaseAuth, async (req, res) => {
  try {
    // Validate book ID
    const validation = BookIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        errors: validation.error.flatten(),
      });
    }

    const { id } = validation.data;

    // Find book
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.error("Get book by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
});

export default router;
