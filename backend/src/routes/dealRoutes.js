const express = require("express");
const {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  convertLeadToDeal,
} = require("../controllers/dealController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDeal);
router.post("/convert", protect, convertLeadToDeal);
router.get("/", protect, getAllDeals);
router.get("/:id", protect, getDealById);
router.put("/:id", protect, updateDeal);
router.delete("/:id", protect, deleteDeal);

module.exports = router;