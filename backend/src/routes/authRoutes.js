const express = require("express");
const { loginLimiter, registerLimiter } = require('../middleware/rateLimitMiddleware.js');
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register",registerLimiter, registerUser);
router.post("/login",loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;