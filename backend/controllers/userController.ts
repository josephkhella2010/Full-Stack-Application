/* import { Request, Response } from "express";
import { User } from "../models/UserSchema.js";
import { AuthRequest } from "../middleware/verifyFirebaseToken.js";

// Get users from PostgreSQL
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "firebaseUid",
        "firstname",
        "lastname",
        "username",
        "email",
      ],
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Could not retrieve users:", error);

    return res.status(500).json({
      message: "Could not retrieve users",
    });
  }
};

// Register user in PostgreSQL
export const registerUser = async (req: AuthRequest, res: Response) => {
  try {
    const { firstname, lastname, username } = req.body;

    const firebaseUid = req.user?.uid;
    const email = req.user?.email;

    if (!firebaseUid || !email) {
      return res.status(401).json({
        message: "Invalid Firebase token",
      });
    }

    if (!firstname || !lastname || !username) {
      return res.status(400).json({
        message: "All profile fields are required",
      });
    }

    const existingUser = await User.findOne({
      where: { firebaseUid },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists in PostgreSQL",
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      firebaseUid,
    });

    return res.status(201).json({
      message: "User saved successfully in PostgreSQL",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Could not save user",
    });
  }
};
 */
