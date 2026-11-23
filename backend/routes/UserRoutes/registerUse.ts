import express from "express";
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
