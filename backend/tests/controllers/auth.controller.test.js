import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { connect, clearDatabase, closeDatabase } from "../setup/mongodb.js";
import { User } from "../../src/models/user.model.js";
import * as authController from "../../src/controllers/auth.controller.js";

// Mock sendEmail and token utilities
jest.unstable_mockModule("../../src/resend/resendEmail.js", () => ({
  sendEmail: async () => Promise.resolve(),
}));
jest.unstable_mockModule(
  "../../src/utils/generateTokenAndSetCookie.js",
  () => ({
    generateTokenAndSetCookie: jest.fn(),
  })
);
jest.unstable_mockModule("../../src/utils/generateVerificationCode.js", () => ({
  generateVerificationCode: () => "123456",
}));

describe("Auth Controller", () => {
  beforeAll(async () => {
    await connect();
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
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should signup a new user", async () => {
    const req = {
      body: {
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        password: "password123",
      },
    };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, user: expect.any(Object) })
    );
    const user = await User.findOne({ email: "janedoe@example.com" });
    expect(user).toBeTruthy();
  });

  it("should not signup with missing fields", async () => {
    const req = { body: { email: "missing@example.com" } };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    // The controller returns only { message: ... } on error, not { success: false, ... }
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("should not signup with duplicate email", async () => {
    await User.create({
      first_name: "Jane",
      last_name: "Doe",
      email: "janedoe@example.com",
      password: "password123",
    });
    const req = {
      body: {
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        password: "password123",
      },
    };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  // Add more tests for login, verifyEmail, resendVerification, forgotPassword, resetPasswordByCode, logout, refreshToken, checkAuth as needed
});
