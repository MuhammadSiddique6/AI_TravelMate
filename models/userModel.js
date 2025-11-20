const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_pic: { type: String },
  preferences: {
    budget: { type: Number, default: 0 },
    time: { type: String },
    interests: [{ type: String }],
  },
  language: { type: String, enum: ["English", "Urdu"], default: "English" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
