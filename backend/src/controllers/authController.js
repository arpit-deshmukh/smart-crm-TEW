const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      approvalStatus: "pending",
      approvalMessage: "Waiting for admin approval",
    });

    return res.status(201).json({
      message: "Account request submitted successfully. Wait for admin approval.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in registration",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.role !== "admin") {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({
          message: "Your account request is still pending admin approval",
        });
      }

      if (user.approvalStatus === "denied") {
        return res.status(403).json({
          message: "Your account request was denied by admin",
        });
      }
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in login",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Logout failed",
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Logout successful",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in logout",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    return res.status(200).json({
      user: req.session.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching current user",
      error: error.message,
    });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        message: "Invalid Google account data",
      });
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || "Google User";
    const picture = payload.picture || "";
    const emailVerified = payload.email_verified;

    if (!emailVerified) {
      return res.status(400).json({
        message: "Google email is not verified",
      });
    }

    let user = await User.findOne({ email });

    // Existing user
    if (user) {
      if (user.role !== "admin") {
        if (user.approvalStatus === "pending") {
          return res.status(403).json({
            message: "Your account request is still pending admin approval",
          });
        }

        if (user.approvalStatus === "denied") {
          return res.status(403).json({
            message: "Your account request was denied by admin",
          });
        }
      }

      // optional: refresh profile image from Google only if empty
      if (!user.profileImage && picture) {
        user.profileImage = picture;
        await user.save();
      }

      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({
        message: "Google login successful",
        user: req.session.user,
      });
    }

    // New user: create pending request
    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(
        Math.random().toString(36) + Date.now().toString(),
        10
      ),
      role: "user",
      profileImage: picture || "https://i.pravatar.cc/150?img=12",
      approvalStatus: "pending",
      approvalMessage: "Waiting for admin approval",
      isActive: true,
    });

    return res.status(201).json({
      message:
        "Google account request submitted successfully. Wait for admin approval.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in Google authentication",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
          <p style="margin-top:16px;">This link will expire in 15 minutes.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending reset link",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  googleAuth,
  forgotPassword,
  resetPassword,
};