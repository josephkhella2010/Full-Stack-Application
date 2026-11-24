import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin.js";

export interface AuthRequest extends Request {
  auth?: {
    payload: {
      sub: string;
      email?: string;
      name?: string;
    };
  };
}

export const firebaseAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
    }

    const token = authHeader.substring(7);

    const decoded = await adminAuth.verifyIdToken(token);

    req.auth = {
      payload: {
        sub: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      },
    };

    next();
  } catch (error) {
    console.error("Firebase authentication failed:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
};

export default firebaseAuth;
