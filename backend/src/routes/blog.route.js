import express from "express";
import {
  createBlog,
  publishBlog,
  editBlog,
  deleteBlog,
  getMyBlogs,
  getPublishedBlogs,
  getSinglePublishedBlog,
  getMyBlogById,
} from "../controllers/blog.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Public endpoints
router.get("/", getPublishedBlogs); // List published blogs
router.get("/:id", getSinglePublishedBlog); // Get single published blog

// Protected endpoints
router.post("/", verifyToken, createBlog); // Create blog
router.get("/me/blogs", verifyToken, getMyBlogs); // Get my blogs
router.get("/me/blogs/:id", verifyToken, getMyBlogById);
router.patch("/:id/publish", verifyToken, publishBlog); // Publish blog
router.patch("/:id", verifyToken, editBlog); // Edit blog
router.delete("/:id", verifyToken, deleteBlog); // Delete blog

export default router;
