import { Router } from "express";
import { Book } from "../../models/BookSchema.js";

import {
  firebaseAuth,
  type AuthRequest,
} from "../../middleware/firebaseAuth.js";

import { UserIdSchema } from "../../zodValidation/BookSchema.js";

const router = Router();

// GET books belonging to a specific user
router.get("/books/user/:uid", firebaseAuth, async (req, res) => {
  try {
    // 1. Validate Firebase UID from URL
    const validation = UserIdSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        errors: validation.error.flatten(),
      });
    }

    const { uid } = validation.data;

    // 2. Get logged-in user's Firebase UID from token
    const loggedInUserId = (req as AuthRequest).auth?.payload.sub;

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    // 3. Check that the requested UID belongs to logged-in user
    if (uid !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own books",
      });
    }

    // 4. Find books belonging to this user
    const books = await Book.findAll({
      where: {
        userId: uid,
      },
      order: [["createdAt", "DESC"]],
    });

    // 5. Return books
    return res.status(200).json({
      success: true,
      message: "User books fetched successfully",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get user books error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user books",
    });
  }
});

export default router;