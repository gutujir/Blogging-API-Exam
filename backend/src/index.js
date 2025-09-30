import express from "express";
import { connectDB } from "./config/connectDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import blogRouter from "./routes/blog.route.js";

dotenv.config();

const app = express();

// CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
