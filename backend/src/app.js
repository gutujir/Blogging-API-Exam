import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Blog } from "./models/blog.model.js";
import authRouter from "./routes/auth.route.js";
import blogRouter from "./routes/blog.route.js";

const app = express();

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
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
app.use(express.json());
app.use(cookieParser());

// Attach models to req for inline controllers
app.use((req, res, next) => {
  req.models = { Blog };
  next();
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

export default app;
