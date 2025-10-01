import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { connect, clearDatabase, closeDatabase } from "../setup/mongodb.js";
import { Blog } from "../../src/models/blog.model.js";
import * as blogController from "../../src/controllers/blog.controller.js";

describe("Blog Controller", () => {
  let userId;
  let blogId;
  beforeAll(async () => {
    await connect();
    userId = new mongoose.Types.ObjectId();
  });
  afterEach(async () => {
    await clearDatabase();
  });
  afterAll(async () => {
    await closeDatabase();
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should create a blog (createBlog)", async () => {
    const req = {
      body: {
        title: "Controller Blog",
        body: "Blog body content.",
        description: "desc",
        tags: ["tag1"],
      },
      userId: userId.toString(),
    };
    const res = mockRes();
    await blogController.createBlog(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, blog: expect.any(Object) })
    );
    const blog = await Blog.findOne({ title: "Controller Blog" });
    expect(blog).toBeTruthy();
    blogId = blog._id;
  });

  it("should not create blog with missing fields", async () => {
    const req = { body: {}, userId: userId.toString() };
    const res = mockRes();
    await blogController.createBlog(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    // The controller returns only { message: ... } on error, not { success: false, ... }
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("should publish a blog (publishBlog)", async () => {
    const blog = await Blog.create({
      title: "To Publish",
      body: "body",
      author: userId,
    });
    const req = {
      params: { id: blog._id.toString() },
      userId: userId.toString(),
    };
    const res = mockRes();
    await blogController.publishBlog(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, blog: expect.any(Object) })
    );
    const updated = await Blog.findById(blog._id);
    expect(updated.state).toBe("published");
  });

  it("should edit a blog (editBlog)", async () => {
    const blog = await Blog.create({
      title: "To Edit",
      body: "body",
      author: userId,
    });
    const req = {
      params: { id: blog._id.toString() },
      userId: userId.toString(),
      body: { title: "Edited Title" },
    };
    const res = mockRes();
    await blogController.editBlog(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, blog: expect.any(Object) })
    );
    const updated = await Blog.findById(blog._id);
    expect(updated.title).toBe("Edited Title");
  });

  it("should delete a blog (deleteBlog)", async () => {
    const blog = await Blog.create({
      title: "To Delete",
      body: "body",
      author: userId,
    });
    const req = {
      params: { id: blog._id.toString() },
      userId: userId.toString(),
    };
    const res = mockRes();
    await blogController.deleteBlog(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: expect.any(String) })
    );
    const deleted = await Blog.findById(blog._id);
    expect(deleted).toBeNull();
  });

  it("should get my blogs (getMyBlogs)", async () => {
    await Blog.create({
      title: "My Blog",
      body: "body",
      author: userId,
    });
    const req = { query: {}, userId: userId.toString() };
    const res = mockRes();
    await blogController.getMyBlogs(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, blogs: expect.any(Array) })
    );
  });

  it("should get my blog by id (getMyBlogById)", async () => {
    const blog = await Blog.create({
      title: "My Blog By Id",
      body: "body",
      author: userId,
    });
    const req = {
      params: { id: blog._id.toString() },
      userId: userId.toString(),
    };
    const res = mockRes();
    await blogController.getMyBlogById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, blog: expect.any(Object) })
    );
  });

  it("should get published blogs (getPublishedBlogs)", async () => {
    await Blog.create({
      title: "Published Blog",
      body: "body",
      author: userId,
      state: "published",
    });
    const req = { query: {} };
    const res = mockRes();
    await blogController.getPublishedBlogs(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ blogs: expect.any(Array) })
    );
  });

  it("should get single published blog (getSinglePublishedBlog)", async () => {
    const blog = await Blog.create({
      title: "Single Published",
      body: "body",
      author: userId,
      state: "published",
    });
    const req = { params: { id: blog._id.toString() } };
    const res = mockRes();
    await blogController.getSinglePublishedBlog(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ blog: expect.any(Object) })
    );
  });
});
