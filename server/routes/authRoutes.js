import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";
import nodemailer from "nodemailer";


import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
const SECRET_KEY = "your_secret_key";



// Get absolute path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
  const { to, subject,  trackingNumber, amount,dueDate} = req.body;



   // UPS Email Template
  

  try {
      const info = await transporter.sendMail({
          from:"UPS Shipping", // Sender
          to, // Recipient
          subject, // Email Subject
          html: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Request for Your Shipment</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      background: #ffffff;
                      margin: 20px auto;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                      text-align: center;
                  }
                  .logo {
                      text-align: center;
                      margin-bottom: 20px;
                  }
                  .logo img {
                      max-width: 150px;
                  }
                  .header {
                      background-color: #d8a407;
                      padding: 15px;
                      color: white;
                      font-size: 20px;
                      font-weight: bold;
                      
                  }
                  .content {
                      padding: 20px;
                      color: #333;
                      text-align: left;
                      line-height: 1.6;
                  }
                  .cta-button {
                      display: block;
                      width: 200px;
                      background-color: #d8a407;
                      color: white;
                      text-align: center;
                      padding: 10px;
                      margin: 20px auto;
                      border-radius: 5px;
                      text-decoration: none;
                      font-size: 16px;
                      font-weight: bold;
                  }
                  .cta-button:hover {
                      background-color: #d8a407;
                  }
                  .footer {
                      text-align: center;
                      font-size: 12px;
                      color: #888;
                      padding: 10px;
                  }
              </style>
          </head>
          <body>
       
              <div class="container">
                  <!-- UPS Logo -->
                  <div class="logo">
                     <img src="cid:ups" alt="UPS Logo" width="150">
                  </div>
       
                  <div class="header">
                      UPS Shipping – Payment Required
                  </div>
       
                  <div class="content">
                     <p>Dear Customer,</p>
            <p>We regret to inform you that your package <strong>(Tracking No: ${trackingNumber})</strong> has been temporarily <strong>seized</strong> and placed on hold at our facility due to outstanding customs and processing fees.</p>

            <p><strong>Payment Required for Release:</strong></p>
            <ul>
                <li><strong>Outstanding Amount:</strong> $${amount}</li>
                <li><strong>Due Date:</strong> ${dueDate}</li>
                <li><strong>Reason for Hold:</strong> Unpaid clearance and delivery fees</li>
                <li><strong>Payment Methods:</strong> Bank Transfer, Credit Card, or PayPal</li>
            </ul>

            <p>Your shipment will remain on hold until the required payment is received. Failure to complete payment by the due date may result in **additional storage fees or return of the package** to the sender.</p>

            <p>To **release your package and schedule immediate delivery**, please contact your delivery agent for payment processing:</p>
          

            <p>If you have already made payment, please disregard this notice. Otherwise, we strongly advise you to complete payment as soon as possible to avoid further delays.</p>

            <p>For further assistance, contact our support team at <a href="mailto:support@ups.com">support@ups.com</a> or call 📞 +1-800-742-5877.</p>

            <p>Thank you for your prompt attention to this matter.</p>

            <p>Best regards,</p>
            <p><strong>UPS Customer Support</strong><br>
            📞 +1-800-742-5877 | ✉ support@ups.com</p>
        </div>

        <div class="footer">
            &copy; ${new Date().getFullYear()} UPS. All Rights Reserved.
        </div>
              </div>
       
          </body>
          </html>
          ` ,// Email Body
          attachments: [
            {
              filename: "ups.jpg",
              path: path.join(__dirname, "ups.jpg"), // ✅ Use correct path
              cid: "ups_logo", // ✅ Match this with `cid` in <img>
            },
          ],
      });

      res.status(200).json({ success: true, info });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
