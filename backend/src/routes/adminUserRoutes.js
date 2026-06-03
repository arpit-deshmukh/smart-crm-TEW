const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require("../controllers/adminUserController");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.put("/:id/role", protect, updateUserRole);
router.put("/:id/toggle-status", protect, toggleUserStatus);
router.delete("/:id", protect, deleteUser);

module.exports = router;