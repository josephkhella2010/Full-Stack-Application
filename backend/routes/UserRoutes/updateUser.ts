import { Router } from "express";
import { UniqueConstraintError } from "sequelize";
import { sequelize } from "../../config/database.js";
import { User } from "../../models/UserSchema.js";
import { adminAuth } from "../../config/firebaseAdmin.js";
import firebaseAuth from "../../middleware/firebaseAuth.js";
import type { AuthRequest } from "../../middleware/firebaseAuth.js";
import { idSchema, updateUserSchema } from "../../zodvalidation/UserSchema.js";

const router = Router();

router.put("/users/:uid", firebaseAuth, async (req: AuthRequest, res) => {
  let firebaseEmailChanged = false;
  let previousFirebaseEmail = "";

  try {
    // 1. Validate UID using Zod
    const parsedUid = idSchema.safeParse(req.params);

    if (!parsedUid.success) {
      return res.status(400).json({
        success: false,
        message: parsedUid.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
    }

    const requestedUid = parsedUid.data.uid;

    // 2. Get Firebase UID from verified token
    const firebaseUid = req.auth?.payload.sub;

    if (!firebaseUid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Check that the user updates their own account
    if (requestedUid !== firebaseUid) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another user's profile",
      });
    }

    // 4. Validate request body using Zod
    const parsedBody = updateUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: parsedBody.error.issues
          .map((issue) => issue.message)
          .join(", "),
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { firstname, lastname, username, email } = parsedBody.data;

    // 5. Check that at least one field was provided
    if (Object.keys(parsedBody.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    // 6. Find user in PostgreSQL
    const user = await User.findOne({
      where: { firebaseUid },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // 7. Check if username already exists
    if (username !== undefined) {
      const existingUsername = await User.findOne({
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("username")),
          username.toLowerCase(),
        ),
      });

      if (existingUsername && existingUsername.get("id") !== user.get("id")) {
        return res.status(409).json({
          success: false,
          message:
            "This username already exists. Please choose another username.",
        });
      }
    }

    // 8. Check if email already exists in PostgreSQL
    if (email !== undefined) {
      const existingEmail = await User.findOne({
        where: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          email.toLowerCase(),
        ),
      });

      if (existingEmail && existingEmail.get("id") !== user.get("id")) {
        return res.status(409).json({
          success: false,
          message: "This email already exists. Please choose another email.",
        });
      }
    }

    // 9. Update Firebase email if email has changed
    if (email !== undefined && email !== user.get("email")) {
      previousFirebaseEmail = String(user.get("email"));

      await adminAuth.updateUser(firebaseUid, {
        email,
      });

      firebaseEmailChanged = true;
    }

    // 10. Update PostgreSQL profile
    await user.update({
      ...(firstname !== undefined && { firstname }),
      ...(lastname !== undefined && { lastname }),
      ...(username !== undefined && { username }),
      ...(email !== undefined && { email }),
    });

    // Both updates succeeded
    firebaseEmailChanged = false;

    // 11. Return updated user
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.get("id"),
        firebaseUid: user.get("firebaseUid"),
        firstname: user.get("firstname"),
        lastname: user.get("lastname"),
        username: user.get("username"),
        email: user.get("email"),
        createdAt: user.get("createdAt"),
        updatedAt: user.get("updatedAt"),
      },
    });
  } catch (error: unknown) {
    console.error("Update user error:", error);

    // 12. Restore Firebase email if PostgreSQL update failed
    if (firebaseEmailChanged) {
      try {
        const firebaseUid = req.auth?.payload.sub;

        if (firebaseUid && previousFirebaseEmail) {
          await adminAuth.updateUser(firebaseUid, {
            email: previousFirebaseEmail,
          });
        }
      } catch (rollbackError) {
        console.error("Firebase email rollback failed:", rollbackError);
      }
    }

    // 13. Handle PostgreSQL unique constraint errors
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        success: false,
        message:
          "Email or username already exists. Please choose another email or username.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

export default router;
