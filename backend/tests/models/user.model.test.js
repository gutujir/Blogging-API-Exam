import mongoose from "mongoose";
import { connect, clearDatabase, closeDatabase } from "../setup/mongodb.js";
import { User } from "../../src/models/user.model.js";

describe("User Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should create and save a user successfully", async () => {
    const userData = {
      first_name: "Jane",
      last_name: "Doe",
      email: "janedoe@example.com",
      password: "password123",
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.first_name).toBe(userData.first_name);
    expect(savedUser.last_name).toBe(userData.last_name);
    expect(savedUser.password).toBe(userData.password);
  });

  it("should not save user without required fields", async () => {
    const user = new User({ email: "no-fields@example.com" });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.first_name).toBeDefined();
    expect(err.errors.last_name).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should not allow duplicate emails", async () => {
    const userData = {
      first_name: "John",
      last_name: "Smith",
      email: "duplicate@example.com",
      password: "password123",
    };
    await new User(userData).save();
    let err;
    try {
      await new User(userData).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Mongo duplicate key error
  });
});
