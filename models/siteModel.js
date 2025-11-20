const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },

    description: {
      urdu: { type: String, required: true },
      english: { type: String, required: true },
    },

    images: [{ type: String }],
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    voice_guide: {
      urdu: { type: String },
      english: { type: String },
    },

    last_selected: {
      date: { type: String },
      day: { type: String },
    },

    weekly_weather: [
      {
        date: { type: String }, // easier for frontend date formatting
        temperature: { type: Number },
        description: { type: String },
        icon: { type: String }, // optional: OpenWeather icon code
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Site", siteSchema);
