import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import Tracking from "./models/Tracking.js"; // ✅ Import model instead of redefining it


const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors({ origin: 'https://trackifycourier-website.vercel.app' }));

app.use("/auth", authRoutes);
app.use("/track", trackingRoutes);


// MongoDB Connection
mongoose.connect("mongodb+srv://highprechi:highprechi@cluster0.2fpf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Atlas Error:", err));

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
