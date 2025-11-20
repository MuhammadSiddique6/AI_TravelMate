const express = require("express");
const router = express.Router();
const { addSite, getAllSites, getSiteById } = require("../controllers/siteController");
const auth = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllSites);
router.post("/:id", getSiteById);

// Admin Protected (optional)
router.post("/", auth, addSite);

module.exports = router;
