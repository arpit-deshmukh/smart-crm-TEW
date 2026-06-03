const express = require("express");
const {
  createFollowup,
  getAllFollowups,
  getFollowupById,
  updateFollowup,
  deleteFollowup,
  convertLeadToFollowup,
} = require("../controllers/followupController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFollowup);
router.post("/convert-from-lead", protect, convertLeadToFollowup);
router.get("/", protect, getAllFollowups);
router.get("/:id", protect, getFollowupById);
router.put("/:id", protect, updateFollowup);
router.delete("/:id", protect, deleteFollowup);

module.exports = router;