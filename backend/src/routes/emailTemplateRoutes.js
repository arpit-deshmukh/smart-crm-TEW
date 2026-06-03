const express = require("express");
const {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
} = require("../controllers/emailTemplateController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEmailTemplate);
router.get("/", protect, getAllEmailTemplates);
router.get("/:id", protect, getEmailTemplateById);
router.put("/:id", protect, updateEmailTemplate);
router.delete("/:id", protect, deleteEmailTemplate);

module.exports = router;