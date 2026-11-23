import "dotenv/config";
import express from "express";
import { connectDatabase } from "./config/connectDatabase.js";
import getAllUsers from "./routes/UserRoutes/getAllUser.js";
import registerUser from "./routes/UserRoutes/registerUse.js";
const app = express();
const PORT = Number(process.env.PORT) || 5300;

app.use(express.json());



// API test
app.get("/api/test", (_req, res) => {
  res.json({
    message: "API is working!",
  });
});

// User routes
app.use("/api", getAllUsers);
app.use("/api", registerUser);

// Start server
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDatabase();
});
