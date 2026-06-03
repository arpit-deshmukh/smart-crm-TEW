const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAllActivities } = require("../controllers/adminActivityController");

const router = express.Router();

router.get("/", protect, getAllActivities);

module.exports = router;