// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEgBLqIou_30pbFrPJLsWQg_80kSseqIQ",
  authDomain: "final-fullstack-project-ee025.firebaseapp.com",
  projectId: "final-fullstack-project-ee025",
  storageBucket: "final-fullstack-project-ee025.firebasestorage.app",
  messagingSenderId: "672442628522",
  appId: "1:672442628522:web:f20ddb8227cc265adb53d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
