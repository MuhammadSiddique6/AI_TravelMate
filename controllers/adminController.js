const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ======================================================
   ADMIN LOGIN (same collection, role-based)
====================================================== */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email: email.trim(), role: "admin" }).select("+password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Admin login failed", error: error.message });
  }
};


/* ======================================================
   GET ALL USERS (exclude admins)
====================================================== */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      totalUsers: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

/* ======================================================
   BLOCK USER
====================================================== */
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "user" },
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found or cannot block admin"
      });
    }

    res.status(200).json({ message: "User blocked successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Failed to block user",
      error: error.message
    });
  }
};

/* ======================================================
   UNBLOCK USER
====================================================== */
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "user" },
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found or cannot unblock admin"
      });
    }

    res.status(200).json({ message: "User unblocked successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Failed to unblock user",
      error: error.message
    });
  }
};

/* ======================================================
   DELETE USER (admin safe)
====================================================== */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "user"
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found or cannot delete admin"
      });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};
