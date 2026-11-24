import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseConfig/firebaseConfig";

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Register user in Firebase
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // 2. Get Firebase token
      const token = await result.user.getIdToken();

      // 3. Save user in PostgreSQL through Express
      const response = await fetch("http://localhost:5020/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save user");
      }

      alert("Registration successful!");

      setFormData({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (err: any) {
      console.error("Firebase error code:", err.code);
      console.error("Firebase error message:", err.message);
      console.error("Full Firebase error:", err);

      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create an account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="firstname"
          placeholder="First name"
          value={formData.firstname}
          onChange={handleChange}
          minLength={2}
          required
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last name"
          value={formData.lastname}
          onChange={handleChange}
          minLength={2}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          pattern="[a-zA-Z0-9_]+"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (at least 6 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RegisterPage;
