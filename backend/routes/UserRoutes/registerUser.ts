import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import { sequelize } from "../../config/database.js";
import { UniqueConstraintError } from "sequelize";
import { adminAuth } from "../../config/firebaseAdmin.js";
import { registerUserSchema } from "../../zodvalidation/UserSchema.js";

const router = Router();

router.post("/register", async (req, res) => {
  let createdFirebaseUid: string | undefined;

  try {
    // 1. Validate registration data with Zod
    const parsed = registerUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues.map((issue) => issue.message).join(", "),
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { firstname, lastname, username, email, password } = parsed.data;

    // 2. Check if username already exists
    const existingUsername = await User.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("username")),
        username.toLowerCase(),
      ),
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // 3. Check if email already exists in PostgreSQL
    const existingEmail = await User.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")),
        email,
      ),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 4. Create Firebase account
    const firebaseUser = await adminAuth.createUser({
      email,
      password,
    });

    createdFirebaseUid = firebaseUser.uid;

    // 5. Save user in PostgreSQL
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      firebaseUid: firebaseUser.uid,
    });

    // 6. Return successful response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.get("id"),
        firstname: user.get("firstname"),
        lastname: user.get("lastname"),
        username: user.get("username"),
        email: user.get("email"),
        firebaseUid: user.get("firebaseUid"),
      },
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);

    // 7. Delete Firebase account if PostgreSQL creation failed
    if (createdFirebaseUid) {
      try {
        await adminAuth.deleteUser(createdFirebaseUid);
      } catch (deleteError) {
        console.error("Firebase cleanup failed:", deleteError);
      }
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        success: false,
        message: "Email or username is already taken",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

export default router;
