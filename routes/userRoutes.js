const express = require("express");
const router = express.Router();
const { signup, login, getUserProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Route
router.get("/profile", auth, getUserProfile);

module.exports = router;
