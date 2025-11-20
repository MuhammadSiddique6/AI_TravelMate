const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destinations: [{
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    day: { type: Number },
    notes: { type: String },
  }],
  budget: { type: Number },
  duration: { type: String },
  interests: [{ type: String }],
  weather_info: { type: Object },
  status: { type: String, enum: ["planned", "completed"], default: "planned" },
}, { timestamps: true });

module.exports = mongoose.model("Itinerary", itinerarySchema);
