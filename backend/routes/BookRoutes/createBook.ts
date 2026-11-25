import { Router } from "express";
import { Book } from "../../models/BookSchema.js";
import { firebaseAuth } from "../../middleware/firebaseAuth.js";
import { createBookSchema } from "../../zodValidation/BookSchema.js";

const router = Router();

router.post("/books", firebaseAuth, async (req, res) => {
  try {
    // Validate request body
    const validation = createBookSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.issues.map((issue) => issue.message),
        errors: validation.error.flatten(),
      });
    }

    const { title, author, description } = validation.data;

    // Create book without assigning a user
    const book = await Book.create({
      title,
      author,
      description,
      userId: null,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
});

export default router;
