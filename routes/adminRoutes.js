const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

// Admin Login (public)
router.post("/login", adminLogin);

module.exports = router;
