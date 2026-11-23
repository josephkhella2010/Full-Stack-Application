import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseConfig/firebaseConfig";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Log in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Get Firebase ID token
      const token = await userCredential.user.getIdToken();
      // Get logged-in user
      const user = userCredential.user;

      // Print user information
      console.log("User:", user.email);
      console.log("User:", user.uid);

      // Print token in browser console
      console.log("Firebase ID Token:", token);

      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
