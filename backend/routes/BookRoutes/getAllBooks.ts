import { Router } from "express";
import { Op, type Order } from "sequelize";

import { Book } from "../../models/BookSchema.js";
import { getBooksQuerySchema } from "../../zodValidation/BookSchema.js";
import { firebaseAuth } from "../../middleware/firebaseAuth.js";

const router = Router();

router.get("/books", firebaseAuth, async (req, res) => {
  try {
    // Validate query parameters
    const validation = getBooksQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: validation.error.flatten(),
      });
    }

    const { title, sortBy, dateOrder, titleOrder } = validation.data;

    // Search by title
    const where = title
      ? {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      }
      : {};

    // Sort using only the selected sorting method
    const order: Order =
      sortBy === "date"
        ? [["createdAt", dateOrder === "asc" ? "ASC" : "DESC"]]
        : [["title", titleOrder === "az" ? "ASC" : "DESC"]];

    // Fetch books
    const books = await Book.findAll({
      where,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
});

export default router;
