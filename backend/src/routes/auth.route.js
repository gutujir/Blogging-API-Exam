import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPasswordByCode,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password-by-code", resetPasswordByCode);

export default router;
