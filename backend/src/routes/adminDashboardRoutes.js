const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAdminDashboardSummary,
} = require("../controllers/adminDashboardController");

const router = express.Router();

router.get("/summary", protect, getAdminDashboardSummary);

module.exports = router;