import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { calculateReadingTime } from "../utils/readingTime.js";

// Create a new blog (draft by default)
export const createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
    const reading_time = calculateReadingTime(body);
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.userId,
      reading_time,
    });
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Publish a blog (owner only)
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    blog.state = "published";
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Edit a blog (owner only)
export const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, description, tags, body, state } = req.body;
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    if (state && ["draft", "published"].includes(state)) blog.state = state;
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a blog (owner only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get my blogs (owner, paginated, filterable by state)
export const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const filter = { author: req.userId };
    if (state) filter.state = state;
    const blogs = await Blog.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Blog.countDocuments(filter);
    res.json({
      success: true,
      blogs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get published blogs (public, paginated, searchable, orderable)
export const getPublishedBlogs = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      author,
      title,
      tags,
      order_by,
      order = "desc",
    } = req.query;
    const filter = { state: "published" };
    if (author) filter.author = author;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (tags) filter.tags = { $in: tags.split(",") };
    let sort = { created_at: order === "desc" ? -1 : 1 };
    if (
      order_by &&
      ["read_count", "reading_time", "created_at"].includes(order_by)
    ) {
      sort = { [order_by]: order === "desc" ? -1 : 1 };
    }
    const blogs = await Blog.find(filter)
      .populate("author", "first_name last_name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Blog.countDocuments(filter);
    res.json({
      success: true,
      blogs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single published blog (public, increments read_count, returns author info)
export const getSinglePublishedBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      state: "published",
    }).populate("author", "first_name last_name email");
    if (!blog)
      return res
        .status(404)
        .json({ message: "Blog not found or not published" });
    blog.read_count += 1;
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
