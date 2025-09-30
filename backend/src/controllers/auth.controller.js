import bcryptjs from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "../resend/emailTemplates.js";
import { sendEmail } from "../resend/resendEmail.js";

export const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour from now
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    // Send verification email using Resend
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    logger.info("Email verification attempt for code: %s", verificationCode);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // Send welcome email using Resend and styled template
    await sendEmail({
      to: user.email,
      subject: "Welcome to our app!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", user.name),
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error.message, error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    logger.info("Resend verification attempt for email: %s", email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }
    // Generate a new verification code and expiry
    const verificationToken = generateVerificationCode();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day
    await user.save();
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
          "{verificationCode}",
          verificationToken
        ),
      });
      res
        .status(200)
        .json({ success: true, message: "Verification email resent" });
    } catch (emailError) {
      console.error(
        "Resend API error:",
        emailError.message || emailError,
        emailError
      );
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
        error: emailError.message || emailError,
      });
    }
  } catch (error) {
    console.error(
      "Resend verification controller error:",
      error.message,
      error
    );
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate access token (JWT)
    generateTokenAndSetCookie(res, user._id);

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
        refreshToken: undefined,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Remove refresh token from user in DB if present
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.send({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    logger.info("Forgot password attempt for email: %s", email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate a 6-digit numeric code and expiry
    const resetCode = generateVerificationCode();
    const resetCodeExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    user.resetPasswordCode = resetCode;
    user.resetPasswordCodeExpiresAt = resetCodeExpiresAt;
    await user.save();
    // Send password reset code email using Resend
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetCode}", resetCode),
    });
    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email address successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message, error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPasswordByCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    logger.info("Reset password by code attempt for email: %s", email);
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordCodeExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset code",
      });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiresAt = undefined;
    await user.save();
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password by code error:", error.message, error);
    res.status(400).json({ success: false, message: error.message });
  }
};
// Issue new access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }
    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
    // Find user and check stored refresh token matches
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    // Issue new access token
    generateTokenAndSetCookie(res, user._id);
    res.json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    console.log("Check auth for userId:", req.userId);
    console.log("user in checkAuth:", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Check auth error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
