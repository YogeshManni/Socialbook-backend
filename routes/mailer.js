const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const emailTemp = require("../views/emailtemplate");
dotenv.config();

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Store OTPs temporarily (in-memory, for simplicity)
const otpStorage = {};

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
}

// Route to send OTP
router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) return res.send("Email is required.");

  const otp = generateOTP();
  otpStorage[email] = { otp, createdAt: Date.now() }; // Store OTP

  // Send email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `${emailTemp(otp)}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.send({
        status: "failed",
        msg: "Failed to send OTP, please try again",
      });
    }
    res.status(200).send({ status: "success", msg: "OTP sent to your email." });
  });
});

// Route to verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.send({ status: "failed", msg: "Email and OTP are required." });

  const storedOTP = otpStorage[email];

  if (!storedOTP)
    return res.send({ status: "failed", msg: "OTP not found for this email." });

  const currentTime = Date.now();
  const otpAge = (currentTime - storedOTP.createdAt) / 1000; // OTP age in seconds

  if (otpAge > 300) {
    // OTP expires after 5 minutes (300 seconds)
    return res.send({ status: "failed", msg: "OTP has expired." });
  }

  if (storedOTP.otp === otp) {
    return res
      .status(200)
      .json({ status: "success", msg: "OTP verified successfully." });
  }

  res.send({ status: "failed", msg: "Invalid OTP." });
});

module.exports = router;
