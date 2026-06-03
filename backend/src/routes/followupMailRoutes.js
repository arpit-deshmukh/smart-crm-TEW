const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendBulkFollowupMail,
} = require("../controllers/followupMailController");

const router = express.Router();

router.post("/send-bulk", protect, sendBulkFollowupMail);

module.exports = router;