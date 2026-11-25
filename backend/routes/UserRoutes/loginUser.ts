import { Router } from "express";
import { User } from "../../models/UserSchema.js";
import { adminAuth } from "../../config/firebaseAdmin.js";
import { loginSchema } from "../../zodValidation/UserSchema.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    // 1. Validate login data with Zod
    const parsed = loginSchema.safeParse(req.body);

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

    const { email, password } = parsed.data;

    // 2. Get Firebase Web API key
    const apiKey = process.env.FIREBASE_WEB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Firebase configuration is missing",
      });
    }

    // 3. Sign in with Firebase Authentication
    const firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const firebaseData = await firebaseResponse.json();

    // 4. Handle Firebase authentication errors
    if (!firebaseResponse.ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(firebaseData.idToken);

    // 6. Find user in PostgreSQL using Firebase UID
    const user = await User.findOne({
      where: {
        firebaseUid: decodedToken.uid,
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

    // 7. Check if PostgreSQL profile exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // 8. Return successful login with token and user
    return res.status(200).json({
      success: true,
      message: "Login successful",

      token: firebaseData.idToken,

      user: {
        id: user.get("id"),
        firebaseUid: user.get("firebaseUid"),
        firstname: user.get("firstname"),
        lastname: user.get("lastname"),
        username: user.get("username"),
        email: user.get("email"),
        emailVerified: decodedToken.email_verified,
        createdAt: user.get("createdAt"),
        updatedAt: user.get("updatedAt"),
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

export default router;
