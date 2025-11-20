const express = require("express");
const router = express.Router();
const { addFeedback, getFeedbackBySite } = require("../controllers/feedbackController");
const auth = require("../middleware/authMiddleware");

// Protected Routes
router.post("/", auth, addFeedback);
router.get("/:siteId", getFeedbackBySite);

module.exports = router;
