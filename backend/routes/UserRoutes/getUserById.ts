import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import firebaseAuth, { AuthRequest } from "../../middleware/firebaseAuth.js";
import { idSchema } from "../../zodvalidation/UserSchema.js";

const router = Router();

router.get("/users/:uid", firebaseAuth, async (req: AuthRequest, res) => {
  try {
    // 1. Validate UID using Zod
    const parsed = idSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const requestedUid = parsed.data.uid;

    // 2. Get UID from verified Firebase token
    const firebaseUid = req.auth?.payload.sub;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Check that the requested UID belongs to the token owner
    if (requestedUid !== firebaseUid) {
      return res.status(403).json({
        success: false,
        message: "You cannot access another user's profile",
      });
    }

    // 4. Find user in PostgreSQL using Firebase UID
    const user = await User.findOne({
      where: {
        firebaseUid,
      },
      attributes: [
        "id",
        "firebaseUid",
        "firstname",
        "lastname",
        "username",
        "email",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // 5. Return the user's profile
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    console.error("Get user by UID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
    });
  }
});

export default router;
