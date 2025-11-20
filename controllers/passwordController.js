const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const otpfun = require("../utility/otpFun");

let otpStore = {}; 

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const { otp, expiry } = await otpfun(email);
    otpStore[email] = { otp, expiry };

    res.status(200).json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record)
      return res.status(400).json({ message: "No OTP found or expired" });

    if (Date.now() > record.expiry)
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== Number(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    otpStore[email].verified = true;

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password are required" });

    const record = otpStore[email];
    if (!record || !record.verified)
      return res.status(403).json({ message: "OTP not verified. Please verify first." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete otpStore[email];

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

