import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin.js";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No Firebase token provided",
      });
    }

    const token = authHeader.substring(7);

    const decodedToken = await adminAuth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    console.log("Firebase token verified!");
    console.log("Firebase UID:", decodedToken.uid);

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    return res.status(401).json({
      message: "Invalid or expired Firebase token",
    });
  }
};
