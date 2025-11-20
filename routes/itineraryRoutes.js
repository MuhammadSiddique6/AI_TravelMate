const express = require("express");
const router = express.Router();
const {
  createItinerary,
  getUserItineraries,
  deleteItinerary
} = require("../controllers/itineraryController");

const auth = require("../middleware/authMiddleware");

// Protected Routes
router.post("/", auth, createItinerary);
router.get("/", auth, getUserItineraries);
router.delete("/:id", auth, deleteItinerary);

module.exports = router;
