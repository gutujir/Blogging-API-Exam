import mongoose from "mongoose";
import { connect, clearDatabase, closeDatabase } from "../setup/mongodb.js";
import { Blog } from "../../src/models/blog.model.js";

describe("Blog Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should create and save a blog successfully", async () => {
    const blogData = {
      title: "Test Blog Title",
      description: "A test blog description.",
      author: new mongoose.Types.ObjectId(),
      tags: ["test", "blog"],
      body: "This is the body of the test blog.",
    };
    const blog = new Blog(blogData);
    const savedBlog = await blog.save();
    expect(savedBlog._id).toBeDefined();
    expect(savedBlog.title).toBe(blogData.title);
    expect(savedBlog.state).toBe("draft");
    expect(savedBlog.read_count).toBe(0);
    expect(savedBlog.body).toBe(blogData.body);
    expect(savedBlog.author.toString()).toBe(blogData.author.toString());
  });

  it("should not save blog without required fields", async () => {
    const blog = new Blog({});
    let err;
    try {
      await blog.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.body).toBeDefined();
    expect(err.errors.author).toBeDefined();
  });

  it("should not allow duplicate blog titles", async () => {
    const blogData = {
      title: "Unique Blog Title",
      description: "desc",
      author: new mongoose.Types.ObjectId(),
      body: "body",
    };
    await new Blog(blogData).save();
    let err;
    try {
      await new Blog({
        ...blogData,
        author: new mongoose.Types.ObjectId(),
      }).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Mongo duplicate key error
  });

  it("should default state to 'draft' and read_count to 0", async () => {
    const blogData = {
      title: "Default State Blog",
      author: new mongoose.Types.ObjectId(),
      body: "body",
    };
    const blog = new Blog(blogData);
    const savedBlog = await blog.save();
    expect(savedBlog.state).toBe("draft");
    expect(savedBlog.read_count).toBe(0);
  });
});
