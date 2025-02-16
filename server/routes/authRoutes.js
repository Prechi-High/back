import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET_KEY = "your_secret_key";

// Admin Credentials (Ensure it's in the DB)
const ADMIN_EMAIL = "precious@gmail.com";
const ADMIN_PASSWORD = "p12345";

// Signup
router.post("/signup", async (req, res) => {

 const handler(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://trackifycourier-website.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
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


export default router;
