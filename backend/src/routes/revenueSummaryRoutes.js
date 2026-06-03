const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getRevenueSummary,
} = require("../controllers/revenueSummaryController");

const router = express.Router();

router.get("/", protect, getRevenueSummary);

module.exports = router;