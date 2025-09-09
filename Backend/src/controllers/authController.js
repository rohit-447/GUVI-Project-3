const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be your Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

// Store temporary user data and OTP (in production, use Redis or database)
const tempUsers = new Map();

// Store password reset OTPs (in production, use Redis or database)
const passwordResetOTPs = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "EventBooker - Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">EventBooker - Password Reset</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="background: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Register a new user (Step 1: Send OTP)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store temporary user data with OTP
    const tempUserId = crypto.randomUUID();
    tempUsers.set(tempUserId, {
      name,
      email,
      password,
      role,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      tempUserId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP and complete registration (Step 2)
exports.verifyOTP = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    // Get temporary user data
    const tempUserData = tempUsers.get(tempUserId);
    if (!tempUserData) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification session" });
    }

    // Check if OTP is expired
    if (new Date() > tempUserData.expiresAt) {
      tempUsers.delete(tempUserId);
      return res
        .status(400)
        .json({ message: "OTP has expired. Please register again." });
    }

    // Verify OTP
    if (tempUserData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Create new user
    const user = new User({
      name: tempUserData.name,
      email: tempUserData.email,
      password: tempUserData.password,
      role: tempUserData.role,
      isEmailVerified: true,
    });

    await user.save();

    // Clean up temporary data
    tempUsers.delete(tempUserId);

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { tempUserId } = req.body;

    // Get temporary user data
    const tempUserData = tempUsers.get(tempUserId);
    if (!tempUserData) {
      return res.status(400).json({ message: "Invalid verification session" });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Update temporary user data
    tempUsers.set(tempUserId, {
      ...tempUserData,
      otp: newOTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Reset expiry to 10 minutes
    });

    // Send new OTP email
    await sendOTPEmail(tempUserData.email, newOTP);

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password - Send OTP
// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Check if user signed up with Google and doesn't have a password
    if (!user.password) {
      return res
        .status(400)
        .json({
          message:
            "This account was created with Google. Please login with Google.",
        });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiry (10 minutes)
    const tempResetId = crypto.randomUUID();
    passwordResetOTPs.set(tempResetId, {
      userId: user._id,
      email: user.email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    console.log("Sending OTP email for password reset to:", email, "OTP:", otp);
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
      tempResetId,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Password Reset OTP
exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { tempResetId, otp } = req.body;

    // Get OTP data
    const otpData = passwordResetOTPs.get(tempResetId);
    if (!otpData) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP session" });
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      passwordResetOTPs.delete(tempResetId);
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      tempResetId,
      email: otpData.email,
    });
  } catch (error) {
    console.error("Verify password reset OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { tempResetId, newPassword } = req.body;

    // Get OTP data
    const otpData = passwordResetOTPs.get(tempResetId);
    if (!otpData) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP session" });
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      passwordResetOTPs.delete(tempResetId);
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Find user and update password
    const user = await User.findById(otpData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clean up OTP data
    passwordResetOTPs.delete(tempResetId);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If user signed up with Google and doesn't have a password
    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = (req, res) => {
  try {
    // Generate token for the authenticated user
    const token = generateToken(req.user);

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=authentication_failed`
    );
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
