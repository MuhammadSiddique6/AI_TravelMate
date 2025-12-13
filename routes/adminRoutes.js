const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const {adminLogin, getAllUsers, blockUser, unblockUser, deleteUser} = require("../controllers/adminController");

// Public
router.post("/login", adminLogin);

// Protected admin routes
router.get("/users", auth, adminOnly, getAllUsers);
router.patch("/block-user/:id", auth, adminOnly, blockUser);
router.patch("/unblock-user/:id", auth, adminOnly, unblockUser);
router.delete("/delete-user/:id", auth, adminOnly, deleteUser);

module.exports = router;
