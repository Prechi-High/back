import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";
import nodemailer from "nodemailer";

const router = express.Router();
const SECRET_KEY = "your_secret_key";


// Admin Credentials (Ensure it's in the DB)
const ADMIN_EMAIL = "precious@gmail.com";
const ADMIN_PASSWORD = "p12345";

// Signup
router.post("/signup", async (req, res) => {


  const { userName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const isAdmin = email === ADMIN_EMAIL;
  const user = new User({ userName , email, password, isAdmin });
  await user.save();

  res.json({ message: "User registered successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin }, 
    SECRET_KEY, 
    { expiresIn: "1h" }
  );

  res.json({ token, isAdmin: user.isAdmin });  // ✅ Ensure `isAdmin` is returned
});

// Nodemailer Transporter (Uses Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user:"highprechi@gmail.com", // Your Gmail
      pass:"lgzj opqe ihaj mzco", // Your App Password
  },
});

// Email Route
router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
      const info = await transporter.sendMail({
          from: "highprechi@gmail.com", // Sender
          to, // Recipient
          subject, // Email Subject
          html: `<p>${message}</p>`, // Email Body
      });

      res.status(200).json({ success: true, info });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
