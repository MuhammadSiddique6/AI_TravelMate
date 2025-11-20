const express = require("express");
const nodemailer = require("nodemailer");

const otpfun = async (email) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = Date.now() + 60 * 1000;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ADMIN_GMAIL,
      pass: process.env.Email_Password,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_GMAIL,
    to: email,
    subject: "Forget Password OTP",
    html: `<h3>Your OTP is: <strong>${otp}</strong><br>Don't share opt to any other. Opt will expire within 1 minute</h3>`,
  };

  await transporter.sendMail(mailOptions);
  return { otp, expiry };
};
module.exports = otpfun;
