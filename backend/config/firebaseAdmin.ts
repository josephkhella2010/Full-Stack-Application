import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

let app;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);
