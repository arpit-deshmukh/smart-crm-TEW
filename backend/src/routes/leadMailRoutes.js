const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendBulkLeadMail } = require("../controllers/leadMailController");

const router = express.Router();

router.post("/send-bulk", protect, sendBulkLeadMail);

module.exports = router;