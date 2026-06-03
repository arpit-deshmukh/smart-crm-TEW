const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/create-test-user", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: "testadmin@gmail.com" });

    if (existingUser) {
      return res.json({
        message: "Test user already exists",
        user: existingUser,
      });
    }

    const user = await User.create({
      name: "Test Admin",
      email: "testadmin@gmail.com",
      password: "123456",
      role: "admin",
    });

    res.status(201).json({
      message: "Test user created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating test user",
      error: error.message,
    });
  }
});

module.exports = router;