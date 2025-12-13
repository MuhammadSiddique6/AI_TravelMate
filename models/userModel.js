const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    profile_pic: {
      type: String,
      default: ""
    },

    preferences: {
      budget: {
        type: Number,
        default: 0
      },
      time: {
        type: String
      },
      interests: [
        {
          type: String,
          trim: true
        }
      ]
    },

    language: {
      type: String,
      enum: ["English", "Urdu"],
      default: "English"
    },

    // 🔑 Role-based system
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // 🔒 Only applies to USERS (admin is never blocked)
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 🚫 Prevent admin from being blocked
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.isBlocked = false;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
