const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getUserDashboardSummary } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    message: "Welcome to Admin Dashboard",
    user: req.session.user,
  });
});

router.get("/user", protect, authorizeRoles("user"), (req, res) => {
  res.status(200).json({
    message: "Welcome to User Dashboard",
    user: req.session.user,
  });
});

router.get("/user-summary", protect, getUserDashboardSummary);

module.exports = router;