import express from "express";
import { connectDB } from "./config/connectDB.js";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.route.js";
import blogRouter from "./routes/blog.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

// Catch-all: serve index.html for all non-API routes (SPA support)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
