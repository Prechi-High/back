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
          html: `<p>${message}</p>
          
             <div class="container">
        <div class="header">
            <a href="https://www.ups.com/webassets/icons/logo.svg"> </a> [Your Company Name] – Payment Required
        </div>
        <div class="content">
            <p>Dear <strong>[Client's Name]</strong>,</p>
            <p>We hope you are doing well. We would like to inform you that your shipment **(Tracking No: [Tracking Number])** is ready for delivery. However, we require payment confirmation before proceeding with the final delivery.</p>
            
            <p><strong>Payment Details:</strong></p>
            <ul>
                <li><strong>Invoice No:</strong> [Invoice Number]</li>
                <li><strong>Amount Due:</strong> $[Amount]</li>
                <li><strong>Due Date:</strong> [Due Date]</li>
                <li><strong>Payment Method:</strong> Bank Transfer, Credit Card, or PayPal</li>
            </ul>

            <p>To complete your payment and ensure timely delivery, please click the button below:</p>
            <a href="[Payment Link]" class="cta-button">Make Payment Now</a>

            <p>If you have already made the payment, kindly ignore this message. Otherwise, please complete the payment to avoid any delays.</p>

            <p>For any questions, feel free to contact our support team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>

            <p>Thank you for choosing <strong>[Your Company Name]</strong>.</p>

            <p>Best regards,</p>
            <p><strong>[Your Company Name]</strong><br>
            📞 +[Your Phone Number] | ✉ support@yourcompany.com</p>
        </div>

        <div class="footer">
            &copy; [Year] [Your Company Name]. All Rights Reserved.
        </div>
    </div>
          
          
          `, // Email Body
      });

      res.status(200).json({ success: true, info });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
