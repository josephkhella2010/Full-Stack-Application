/* import express from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/UserSchema.js";
import { userZodSchema } from "../../utilities/validation/userZodSchema.js";
import type { NewUser } from "../../utilities/interfaces.js";

const router = express.Router();

router.post("/regsiter-user", async (req, res) => {
  // Validate request body
  const validationInput = userZodSchema.safeParse(req.body);

  if (!validationInput.success) {
    return res.status(400).json({
      message: validationInput.error.issues.map((issue) => issue.message),
    });
  }
  try {
    // Get validated data
    const { firstname, lastname, username, email, password } =
      validationInput.data;
    // Check if username already exists
    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername) {
      return res.status(409).json({
        message: ["Username already exists"],
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: ["Email already exists"],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    // Convert to plain object
    const createdUser = user.toJSON() as NewUser;

    // Exclude password
    const { password: _password, ...newUser } = createdUser;

    return res.status(201).json({
      message: ["User successfully created"],
      user: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: ["Failed to create user"],
    });
  }
});

export default router;
 */

/* import { Router } from "express";
import { registerUser as registerUserController } from "../../controllers/userController.js";
import { verifyFirebaseToken } from "../../middleware/verifyFirebaseToken.js";

const router = Router();

router.post("/register", verifyFirebaseToken, registerUserController);

export default router; */
/* 

import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import firebaseAuth, { AuthRequest } from "../../middleware/firebaseAuth.js";

const router = Router();

router.post("/register", firebaseAuth, async (req: AuthRequest, res) => {
  try {
    const { firstname, lastname, username } = req.body;

    const { sub: firebaseUid, email } = req.auth!.payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!firstname || !lastname || !username) {
      return res.status(400).json({
        success: false,
        message: "Firstname, lastname and username are required",
      });
    }

    let user = await User.findOne({
      where: { firebaseUid },
    });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    user = await User.create({
      firebaseUid,
      email,
      firstname,
      lastname,
      username,
    });

    const userData = user.toJSON();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

export default router;
 */

import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import { sequelize } from "../../config/database.js";
import { adminAuth } from "../../config/firebaseAdmin.js";
import firebaseAuth, { AuthRequest } from "../../middleware/firebaseAuth.js";
import { registerUserSchema } from "../../zodvalidation/registerUserSchema.js";

const router = Router();

router.post("/register", firebaseAuth, async (req: AuthRequest, res) => {
  const firebaseUid = req.auth?.payload.sub;
  const email = req.auth?.payload.email;

  try {
    // 1. Validate registration data using Zod
    const validation = registerUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    // 2. Get validated data
    const { firstname, lastname, username } = validation.data;

    // 3. Check Firebase identity
    if (!firebaseUid || !email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Firebase authentication",
      });
    }

    // 4. Check if Firebase user already has a profile
    const existingFirebaseUser = await User.findOne({
      where: { firebaseUid },
    });

    if (existingFirebaseUser) {
      return res.status(409).json({
        success: false,
        message: "This user is already registered",
      });
    }

    // 5. Check duplicate email
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 6. Check duplicate username (case-insensitive)
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

    // 7. Create user in PostgreSQL
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      firebaseUid,
    });

    // 8. Return success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.get("id"),
        firstname: user.get("firstname"),
        lastname: user.get("lastname"),
        username: user.get("username"),
        email: user.get("email"),
        firebaseUid: user.get("firebaseUid"),
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email or username is already taken",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

export default router;
