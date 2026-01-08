// Existing imports
const express = require("express");
const router = express.Router();
const { signup, login, getUserProfile, getUserBasicInfo } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Routes
router.get("/profile", auth, getUserProfile);
router.get("/basic-info", auth, getUserBasicInfo); // <-- new route

module.exports = router;