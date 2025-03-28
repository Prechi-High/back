import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// CORS Configuration
const corsOptions = {
  origin: "https://trackifycourier-website.vercel.app", // Allow only your frontend
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Fix Preflight (OPTIONS) Requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://trackifycourier-website.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Stop execution for preflight requests
  }
  next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/email", emailRoutes);
app.use("/track", trackingRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb+srv://highprechi:highprechi@cluster0.2fpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Atlas Error:", err));

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
