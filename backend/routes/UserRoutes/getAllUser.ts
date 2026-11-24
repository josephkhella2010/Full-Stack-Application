import { Router } from "express";
import { adminAuth } from "../../config/firebaseAdmin.js";
import { User } from "../../models/UserSchema.js";
//import firebaseAuth from "../../middleware/firebaseAuth.js";

const router = Router();

router.get("/users", async (_req, res) => {
  try {
    const firebaseResult = await adminAuth.listUsers(1000);

    const databaseUsers = await User.findAll({
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

    const users = firebaseResult.users.map((firebaseUser) => {
      const profile = databaseUsers.find(
        (dbUser) => dbUser.get("firebaseUid") === firebaseUser.uid,
      );

      return {
        id: profile?.get("id") ?? null,
        firebaseUid: firebaseUser.uid,
        firstname: profile?.get("firstname") ?? null,
        lastname: profile?.get("lastname") ?? null,
        username: profile?.get("username") ?? null,
        email: firebaseUser.email ?? null,
        emailVerified: firebaseUser.emailVerified,
        createdAt: profile?.get("createdAt") ?? null,
        updatedAt: profile?.get("updatedAt") ?? null,
      };
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
});

export default router;
