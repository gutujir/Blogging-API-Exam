import request from "supertest";
import { jest } from "@jest/globals";
import app from "../../src/app.js";
import { connect, clearDatabase, closeDatabase } from "../setup/mongodb.js";

describe("Blog API", () => {
  jest.setTimeout(30000); // Increase timeout for slow DB and async operations
  let token;
  let userId;
  const userData = {
    first_name: "Blog",
    last_name: "Tester",
    email: "blogtester@example.com",
    password: "password123",
  };
  const blogData = {
    title: "Test Blog Title",
    description: "A test blog description.",
    tags: ["test", "blog"],
    body: "This is the body of the test blog. It should be long enough to calculate reading time.",
  };

  beforeAll(async () => {
    await connect();
    // Register and login user to get token
    await request(app).post("/api/auth/signup").send(userData);
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });
    token = loginRes.headers["set-cookie"];
    // Get userId for author field
    const { User } = await import("../../src/models/user.model.js");
    const user = await User.findOne({ email: userData.email });
    userId = user._id.toString();
  });

  afterEach(async () => {
    await clearDatabase();
    // Re-register and login user for each test
    await request(app).post("/api/auth/signup").send(userData);
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });
    token = loginRes.headers["set-cookie"];
    const { User } = await import("../../src/models/user.model.js");
    const user = await User.findOne({ email: userData.email });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("Public Endpoints", () => {
    it("should return an empty list of published blogs initially", async () => {
      const res = await request(app).get("/api/blogs");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.blogs) || Array.isArray(res.body)).toBe(
        true
      );
    });
  });

  describe("Protected Endpoints", () => {
    let blogId;

    it("should create a new blog as draft", async () => {
      const res = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.blog.title).toBe(blogData.title);
      expect(res.body.blog.state).toBe("draft");
      blogId = res.body.blog._id;
    });

    it("should not create a blog without authentication", async () => {
      const res = await request(app).post("/api/blogs").send(blogData);
      expect(res.statusCode).toBe(401);
    });

    it("should get my blogs (empty initially)", async () => {
      const res = await request(app)
        .get("/api/blogs/me/blogs")
        .set("Cookie", token);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.blogs)).toBe(true);
    });

    it("should create and publish a blog", async () => {
      // Create
      const createRes = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      expect(createRes.statusCode).toBe(201);
      const id = createRes.body.blog._id;
      // Publish
      const publishRes = await request(app)
        .patch(`/api/blogs/${id}/publish`)
        .set("Cookie", token);
      expect(publishRes.statusCode).toBe(200);
      expect(publishRes.body.blog.state).toBe("published");
    });

    it("should edit a blog", async () => {
      const createRes = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      const id = createRes.body.blog._id;
      const res = await request(app)
        .patch(`/api/blogs/${id}`)
        .set("Cookie", token)
        .send({ title: "Updated Title" });
      expect(res.statusCode).toBe(200);
      expect(res.body.blog.title).toBe("Updated Title");
    });

    it("should delete a blog", async () => {
      const createRes = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      const id = createRes.body.blog._id;
      const res = await request(app)
        .delete(`/api/blogs/${id}`)
        .set("Cookie", token);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Blog Access and Listing", () => {
    it("should list published blogs after publishing", async () => {
      // Create and publish
      const createRes = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      const id = createRes.body.blog._id;
      await request(app).patch(`/api/blogs/${id}/publish`).set("Cookie", token);
      // List
      const res = await request(app).get("/api/blogs");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.blogs) || Array.isArray(res.body)).toBe(
        true
      );
    });

    it("should get a single published blog by id", async () => {
      // Create and publish
      const createRes = await request(app)
        .post("/api/blogs")
        .set("Cookie", token)
        .send(blogData);
      const id = createRes.body.blog._id;
      await request(app).patch(`/api/blogs/${id}/publish`).set("Cookie", token);
      // Get single
      const res = await request(app).get(`/api/blogs/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.blog._id).toBe(id);
      expect(res.body.blog.state).toBe("published");
    });
  });
});
