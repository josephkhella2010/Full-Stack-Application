import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/connectDatabase.js";

// api routes
import userRoutes from "./routes/UserRoutes/getAllUser.js";
import registerUser from "./routes/UserRoutes/registerUser.js";
import getUserById from "./routes/UserRoutes/getUserById.js";
import loginUser from "./routes/UserRoutes/loginUser.js";
import deleteUser from "./routes/UserRoutes/deleteUser.js";
import updateUser from "./routes/UserRoutes/updateUser.js";
// import  api books
import getAllBooks from "./routes/BookRoutes/getAllBooks.js";
import getBookById from "./routes/BookRoutes/getBookById.js";
import createBook from "./routes/BookRoutes/createBook.js";
///
const app = express();
const PORT = Number(process.env.PORT) || 5020;

app.use(
  cors({
    origin: "http://localhost:3012",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// API test
app.get("/api/test", (_req, res) => {
  res.json({
    message: "API is working ",
  });
});

// User routes
app.use("/api", userRoutes);
app.use("/api", registerUser);
app.use("/api", loginUser);
app.use("/api", getUserById);
app.use("/api", deleteUser);
app.use("/api", updateUser);
// Book Routes
app.use("/api", getAllBooks);
app.use("/api", getBookById);
app.use("/api", createBook);

///

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDatabase();
});
