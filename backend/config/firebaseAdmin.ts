import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };
const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as any),
      })
    : getApps()[0];

export const adminAuth = getAuth(app);
