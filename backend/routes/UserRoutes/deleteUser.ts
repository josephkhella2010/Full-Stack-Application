import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import firebaseAuth from "../../middleware/firebaseAuth.js";
import type { AuthRequest } from "../../middleware/firebaseAuth.js";
import { adminAuth } from "../../config/firebaseAdmin.js";
import { idSchema } from "../../zodValidation/UserSchema.js";

const router = Router();

router.delete("/users/:uid", firebaseAuth, async (req: AuthRequest, res) => {
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

    // 2. Get Firebase UID from verified token
    const firebaseUid = req.auth?.payload.sub;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Check that the user deletes their own account
    if (requestedUid !== firebaseUid) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another user's account",
      });
    }

    // 4. Find user in PostgreSQL
    const user = await User.findOne({
      where: { firebaseUid },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // 5. Delete user from Firebase Authentication
    await adminAuth.deleteUser(firebaseUid);

    // 6. Delete user from PostgreSQL
    await user.destroy();

    // 7. Return success response
    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
});

export default router;
