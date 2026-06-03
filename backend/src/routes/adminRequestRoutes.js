const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getPendingRequests,
  approveRequest,
  denyRequest,
} = require("../controllers/adminRequestController");

const router = express.Router();

router.get("/", protect, getPendingRequests);
router.put("/:id/approve", protect, approveRequest);
router.put("/:id/deny", protect, denyRequest);

module.exports = router;