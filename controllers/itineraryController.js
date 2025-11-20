const Itinerary = require("../models/itineraryModel");

exports.createItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create({
      user_id: req.user.id,
      ...req.body,
    });
    res.status(201).json({ message: "Itinerary created successfully", itinerary });
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary", error: error.message });
  }
};

exports.getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user_id: req.user.id })
      .populate("destinations.site_id");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error: error.message });
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting itinerary", error: error.message });
  }
};
