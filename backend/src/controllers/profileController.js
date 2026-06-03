const bcrypt = require("bcryptjs");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");

const getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name, phone, profileImage, bio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.profileImage = profileImage ?? user.profileImage;
    user.bio = bio ?? user.bio;

    await user.save();

    req.session.user = {
      ...req.session.user,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
    
    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Profile",
      details: "Profile updated",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });

    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Profile",
      details: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating password",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.session.user.id;

    await User.findByIdAndDelete(userId);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Account deleted but session cleanup failed",
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Account deleted successfully",
      });
    });

    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Profile",
      details: "Account deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting account",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
};