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



   // UPS Email Template
   const emailHTML = `
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
               background-color: #004aad;
               padding: 15px;
               color: white;
               font-size: 20px;
               font-weight: bold;
               border-radius: 10px 10px 0 0;
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
               background-color: #004aad;
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
               background-color: #003580;
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
               <img src="https://www.ups.com/webassets/icons/logo.svg" alt="UPS Logo">
           </div>

           <div class="header">
               🚚 UPS Shipping – Payment Required
           </div>

           <div class="content">
               <p>Dear Customer,</p>
               <p>We hope you are doing well. Your shipment <strong>(Tracking No: ${trackingNumber})</strong> is ready for delivery. However, we require payment confirmation before proceeding.</p>
               
               <p><strong>Payment Details:</strong></p>
               <ul>
                   <li><strong>Amount Due:</strong> $${amount}</li>
                   <li><strong>Due Date:</strong> ${dueDate}</li>
                   <li><strong>Payment Method:</strong> Bank Transfer, Credit Card, or PayPal</li>
               </ul>

               <p>To complete your payment and ensure timely delivery, please click the button below:</p>
               <a href="${paymentLink}" class="cta-button">Make Payment Now</a>

               <p>If you've already paid, kindly ignore this message. Otherwise, please complete the payment to avoid any delays.</p>

               <p>For any questions, contact our support team at <a href="mailto:support@ups.com">support@ups.com</a>.</p>

               <p>Thank you for choosing <strong>UPS</strong>.</p>

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
   `;

  try {
      const info = await transporter.sendMail({
          from:"highprechi@gmail.com", // Sender
          to, // Recipient
          subject, // Email Subject
          html:emailHTML, // Email Body
      });

      res.status(200).json({ success: true, info });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
